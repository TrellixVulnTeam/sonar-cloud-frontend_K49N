import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { Product } from '../models/product';
import { environment } from 'src/environments/environment';
import {AuthService} from "@auth0/auth0-angular";

interface Cart {
  cartCount: number;
  products: {
    product: Product;
    quantity: number;
  }[];
  totalPrice: number;
}

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private productUrl: string = '/api/product';
  private purchasesUrl: string = '/api/purchases';

  private _cart = new BehaviorSubject<Cart>({
    cartCount: 0,
    products: [],
    totalPrice: 0.0,
  });

  private _cart$ = this._cart.asObservable();

  getCart(): Observable<Cart> {
    return this._cart$;
  }

  setCart(latestValue: Cart) {
    return this._cart.next(latestValue);
  }

  constructor(private http: HttpClient, private authService: AuthService) {}

  public getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(environment.baseUrl + this.productUrl, {
      headers: environment.headers,
    });
  }

  //maybe remove the ending headers if error?
  public getSearchProducts(searchTerm: string): Observable<Product[]> {
    return this.http.get<Product[]>(
      environment.baseUrl + this.productUrl + `/partial-search/${searchTerm}`,
      {
        headers: environment.headers,
      }
    );
  }

  public getSingleProduct(id: number): Observable<Product> {
    return this.http.get<Product>(
      environment.baseUrl + this.productUrl + '/' + id,
      {
        headers: environment.headers,
      }
    );
  }

  public createProduct(
    name: string,
    quantity: number,
    description: string,
    price: number,
    image: string
  ): Observable<any> {
    const payload = {
      name: name,
      quantity: quantity,
      description: description,
      image: 'https://revazon-image-bucket.s3.amazonaws.com/' + image,
      price: price,
    };
    return this.http.put<any>(
      environment.baseUrl + this.productUrl + '/create-update',
      payload,
      {
        headers: environment.headers,
      }
    );
  }

  public updateProduct(
    id: number,
    name: string,
    quantity: number,
    description: string,
    price: number,
    image: string
  ): Observable<any> {
    const payload = {
      id: id,
      name: name,
      quantity: quantity,
      description: description,
      image: image,
      price: price,
    };
    return this.http.put<any>(
      environment.baseUrl + this.productUrl + '/create-update',
      payload,
      {
        headers: environment.headers,
      }
    );
  }

  public purchase(
    products: { id: number; quantity: number }[]
  ): Observable<any> {
    const payload = JSON.stringify(products);
    return this.http.patch<any>(
      environment.baseUrl + this.productUrl,
      payload,
      {
        headers: environment.headers,
      }
    );
  }

  public addPurchase(
    products: { id: number; quantity: number }[]
  ): Observable<any> {
    const payload = JSON.stringify(products);
    const id = sessionStorage.getItem('userId');
    return this.http.post<any>(
      environment.baseUrl + this.purchasesUrl + "/" + id,
      payload,
      {
        headers: environment.headers,
      }
    );
  }
  public deleteProduct(id: number) {
    return this.http.delete<any>(
      environment.baseUrl + this.productUrl + '/' + id,
      {
        headers: environment.headers,
      }
    );
  }
}
