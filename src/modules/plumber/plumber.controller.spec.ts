import { Test, TestingModule } from "@nestjs/testing";
import { PlumberController } from "./plumber.controller";

describe("PlumberController", () => {
  let controller: PlumberController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PlumberController],
    }).compile();

    controller = module.get<PlumberController>(PlumberController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });
});
