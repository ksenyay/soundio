import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto';
import { InjectModel } from '@nestjs/mongoose';
import { Product, ProductDocument } from '../db/schemas/product.schema';
import { Model } from 'mongoose';
import type { Request } from 'express';
import { ClientProxy } from '@nestjs/microservices';
import axios from 'axios';
import { parseStream } from 'music-metadata';

function formatDuration(seconds) {
  const min = Math.floor(seconds / 60);
  const sec = Math.round(seconds % 60);
  return `${min}:${sec.toString().padStart(2, '0')}`;
}

async function extractSoundData(fileUrl: string) {
  const response = await axios.get(fileUrl, { responseType: 'stream' });

  const sizeBytes = Number(response.headers['content-length']) || 0;
  const size = Math.round((sizeBytes / (1024 * 1024)) * 100) / 100;
  const sizeStr = size + ' MB';

  const metadata = await parseStream(response.data, {
    mimeType: response.headers['content-type'],
  });

  const fileDuration = metadata.format.duration;
  const duration =
    typeof fileDuration === 'number' ? formatDuration(fileDuration) : '0:00';

  return { size: sizeStr, duration };
}

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name) private products: Model<ProductDocument>,
    @Inject('PRODUCT_RABBITMQ_SERVICE')
    private readonly productClient: ClientProxy,
  ) {}

  async findAll(
    category?: string,
    search?: string,
    page?: string,
    limit?: string,
  ) {
    const query: any = {};

    if (category) query.category = category;
    if (search) query.title = { $regex: search, $options: 'i' }; // $options: 'i' igrore case

    const pageNum = Number(page) || 1;
    const limitNum = Number(limit) || 20;
    const totalCount = await this.products.countDocuments(query);

    const products = await this.products
      .find(query)
      .sort({ downloads: -1 })
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum)
      .exec();

    if (!products) {
      return [];
    }

    const totalPages = Math.ceil(totalCount / limitNum);

    return { products, totalPages };
  }

  async findById(id: string) {
    const product = await this.products.findById(id).exec();

    if (!product) {
      throw new NotFoundException();
    }

    return product;
  }

  async findByUserId(id: string) {
    const products = await this.products.find({ userId: id }).exec();

    return products;
  }

  async createProduct(
    product: CreateProductDto,
    req: Request,
    files: { imageUrl?: string; fileUrl?: string },
  ) {
    const imageUrl = files.imageUrl;
    const fileUrl = files.fileUrl;

    if (!fileUrl) return;

    const { size, duration } = await extractSoundData(fileUrl);

    const tags = product.tags.split(',');
    const price = Math.round(Number(product.price) * 100) / 100;

    const newProduct = new this.products({
      ...product,
      tags,
      price,
      imageUrl,
      fileUrl,
      userId: req.currentUser!.id,
      username: req.currentUser!.username,
      duration,
      size,
    });

    await newProduct.save();

    await this.productClient.connect();
    this.productClient.emit('product.created', {
      id: newProduct.id,
      title: newProduct.title,
      price: newProduct.price,
    });

    return newProduct;
  }

  async updateDownload(id: string) {
    const product = await this.products.findById(id).exec();

    if (!product) {
      throw new NotFoundException();
    }

    product.downloads += 1;

    return await product.save();
  }

  async deleteProduct(id: string) {
    const product = await this.products.findByIdAndDelete(id).exec();

    this.productClient.emit('product.deleted', {
      id,
    });
    return product;
  }

  // async updateProduct(product: UpdateProductDto, id: string, req: Request) {
  //   const updatedProduct = await this.products
  //     .findByIdAndUpdate(id, product, { new: true })
  //     .exec();

  //   if (!updatedProduct) {
  //     throw new NotFoundException();
  //   }

  //   if (req.currentUser!.id !== updatedProduct.userId) {
  //     throw new UnauthorizedException();
  //   }

  //   this.productClient.emit('product.updated', {
  //     id: updatedProduct.id,
  //     title: updatedProduct.title,
  //     price: updatedProduct.price,
  //   });

  //   return updatedProduct;
  // }
}
