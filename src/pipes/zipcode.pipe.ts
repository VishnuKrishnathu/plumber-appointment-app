import { PipeTransform, Injectable, HttpException, HttpStatus } from "@nestjs/common";

@Injectable()
export class ZipCodeValidationPipe implements PipeTransform {
  transform(value: any) {
    if (typeof value === "string") {
      if (value.length === 5 && !isNaN(Number(value))) {
        return value;
      } else {
        throw new HttpException("Zip code must be a 5 digit number", HttpStatus.BAD_REQUEST);
      }
    } else {
      throw new HttpException("Zip code must be a 5 digit number", HttpStatus.BAD_REQUEST);
    }
  }
}
