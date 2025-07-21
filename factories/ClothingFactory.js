import { Shirt, Pants, Skirt } from "../models/ClothingTypes.js";

class ClothingFactory {
  static createClothing(type, data) {
    switch (type) {
      case "Shirt":
        return new Shirt(data);
      case "Pants":
        return new Pants(data);
      case "Skirt":
        return new Skirt(data);
      default:
        throw new Error("Unknown clothing type");
    }
  }
}

export default ClothingFactory; 