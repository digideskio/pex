define([], function() {
  function Octree(x, y, z, w, h, d) {
    this.root = new Octree.Cell(x, y, z, w, h, d, 0);
  }

  Octree.MaxLevel = 4;

  //p = {x, y, z}
  Octree.prototype.add = function(p) {
    this.root.add(p);
  }

  //check if the point was already added to the octreee
  Octree.prototype.has = function(p) {
    return this.root.has(p);
  }

  Octree.Cell = function(x, y, z, w, h, d, level) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.w = w;
    this.h = h;
    this.d = d;
    this.level = level;
    this.points = [];
    this.children = [];
  }

  Octree.Cell.prototype.has = function(p) {
    if (!this.contains(p)) return null;

    if (this.children.length > 0) {
      for(var i=0; i<this.children.length; i++) {
        var duplicate = this.children[i].has(p);
        if (duplicate) {
          return duplicate;
        }
      }
      return null;
    }
    else {
      for(var i=0; i<this.points.length; i++) {
        var o = this.points[i];
        if (p.x == o.x && p.y == o.y && p.z == o.z) {
          return o;
        }
      }
      return null;
    }
  }

  Octree.Cell.prototype.add = function(p) {
    this.points.push(p);

    if (this.children.length > 0) {
      this.addToChildren(p);
    }
    else {
      if (this.points.length > 1 && this.level < Octree.MaxLevel) {
        this.split();
      }
    }
  }

  Octree.Cell.prototype.addToChildren = function(p) {
    for(var i=0; i<this.children.length; i++) {
      if (this.children[i].contains(p)) {
        this.children[i].add(p);
        break;
      }
    }
  }

  Octree.Cell.prototype.contains = function(p) {
    return p.x >= this.x && p.y >= this.y && p.z >= this.z && p.x <= this.x + this.w && p.y <= this.y + this.h && p.z <= this.z + this.d;
  }

  // 1 2 3 4
  // 5 6 7 8
  Octree.Cell.prototype.split = function() {
    var x = this.x;
    var y = this.y;
    var z = this.z;
    var w2 = this.w/2;
    var h2 = this.h/2;
    var d2 = this.d/2;

    this.children.push(new Octree.Cell(x, y, z, w2, h2, d2, this.level + 1));
    this.children.push(new Octree.Cell(x + w2, y, z, w2, h2, d2, this.level + 1));
    this.children.push(new Octree.Cell(x, y, z + d2, w2, h2, d2, this.level + 1));
    this.children.push(new Octree.Cell(x + w2, y, z + d2, w2, h2, d2, this.level + 1));
    this.children.push(new Octree.Cell(x, y + h2, z, w2, h2, d2, this.level + 1));
    this.children.push(new Octree.Cell(x + w2, y + h2, z, w2, h2, d2, this.level + 1));
    this.children.push(new Octree.Cell(x, y + h2, z + d2, w2, h2, d2, this.level + 1));
    this.children.push(new Octree.Cell(x + w2, y + h2, z + d2, w2, h2, d2, this.level + 1));

    for(var i=0; i<this.points.length; i++) {
      this.addToChildren(this.points[i]);
    }
  }

  return Octree;
});