import { PipeTransform, Injectable, HttpException, HttpStatus } from "@nestjs/common";
import { Types } from "mongoose";

@Injectable()
export class ValidateObjectIdPipe implements PipeTransform<string> {
  async transform(value: string) {
    const isValid = Types.ObjectId.isValid(value);
    console.log(isValid);
    if (!isValid) {
      throw new HttpException("Invalid ID!", HttpStatus.BAD_REQUEST);
    }
    return value;
  }
}
