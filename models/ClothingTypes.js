class Shirt {
  constructor({ name, price, size, material }) {
    this.type = "Shirt";
    this.name = name;
    this.price = price;
    this.size = size;
    this.material = material;
  }
}

class Pants {
  constructor({ name, price, waist, length, material }) {
    this.type = "Pants";
    this.name = name;
    this.price = price;
    this.waist = waist;
    this.length = length;
    this.material = material;
  }
}

class Skirt {
  constructor({ name, price, size, style }) {
    this.type = "Skirt";
    this.name = name;
    this.price = price;
    this.size = size;
    this.style = style;
  }
}

export { Shirt, Pants, Skirt }; 