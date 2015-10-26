// Generated by CoffeeScript 1.10.0
(function() {
  var isUnderscoreDefined,
    indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  isUnderscoreDefined = function(root) {
    var isFunction, us;
    isFunction = function(obj) {
      return typeof obj === 'function';
    };
    return isFunction(us = root != null ? root._ : void 0) && isFunction(us.isObject) && isFunction(us.isFunction) && isFunction(us.keys) && isFunction(us.map) && isFunction(us.clone) && isFunction(us.extend);
  };


  /*
  * Function that creates an enum object value. Uniqueness guarantied by object reference.
  * This objects's unique own field is the Enumeration name. It's read only.
  * @param {string or number} key the enum name, recommanded uppercase
  * @param {string or object} descriptor a string that identifies this value, or an object with fields that will be copied on the returned value. In this case
  * a field '_id' must be provided
  * @param {object} valueProto a prototype the returned object will inherit from
  * @param {string} enumType a string identifying the Enumeration instance this enum constant is bound to
  * @param {object} enumerationProto : the prototype shared with Enumeration instance.prototype
   */

  (function(root, factory) {
    var deps, ref, ref1;
    if (typeof define === 'function' && define.amd) {
      deps = [];
      if (!isUnderscoreDefined(root)) {
        deps.push("underscore");
      }
      return define("enumerationjs", deps, factory);
    } else if (typeof module === 'object' && module.exports) {
      return module.exports = factory(require('underscore'));
    } else if (((ref = root.Package) != null ? (ref1 = ref.underscore) != null ? ref1._ : void 0 : void 0) != null) {
      return root.Enumeration = factory(root.Package.underscore._);
    } else if (root._) {
      return root.Enumeration = factory(root._);
    } else {
      throw new ReferenceError("underscore global object '_' must be defined. Get the bundled version of enumerationjs here : https://github.com/sveinburne/enumerationjs/#bundled or install underscore : http://underscorejs.org/ ");
    }
  })(this, function(_) {
    var Enumeration, constant, enumTypes, mapObject;
    mapObject = function(object, transform, ignorePredicate) {
      var unfiltered;
      unfiltered = _.object(_.map(object, (function(value, key) {
        return [key, transform(value, key)];
      })));
      if (!ignorePredicate) {
        return unfiltered;
      } else {
        return _.omit(unfiltered, ignorePredicate);
      }
    };
    enumTypes = [];

    /**
    * Static function that creates an enum object value. Uniqueness guarantied by object reference.
    * This objects's unique own field is the Enumeration name. It's read only.
    * @param {string or number} key the enum name, recommanded uppercase
    * @param {string or object} descriptor a string that identifies this value, or an object with fields that will be copied on the returned value. In this case
    * a field '_id' must be provided
    * @param {object} valueProto a prototype the returned object will inherit from
    * @param {string} enumType a string identifying the Enumeration instance this enum constant is bound to
    * @param {object} enumerationProto : the prototype shared with Enumeration instance.prototype
     */
    constant = function(enumName, descriptor, valueProto, ids, enumerationProto) {
      var defineReadOnlyProperty, evaluateSchema, getId, identifier, key1, methods, properties, prototype, testReserved, thatConstant, val1, valueIsObject;
      thatConstant = null;
      identifier = descriptor._id || descriptor;
      valueIsObject = descriptor._id != null;
      if (indexOf.call(ids, identifier) >= 0) {
        throw "Duplicate identifier : " + identifier;
      } else {
        ids.push(identifier);
      }
      getId = function() {
        return identifier;
      };
      evaluateSchema = function(schema, includePrototype, evaluateMethods) {
        var objectToIterateOn, recursiveEval;
        recursiveEval = function(obj) {
          if (_.isFunction(obj)) {
            return recursiveEval(obj.call(thatConstant));
          } else if (!_.isObject(obj) || obj === null) {
            return obj;
          } else {
            return mapObject(obj, recursiveEval, function(val) {
              return val === void 0 || _.isFunction(val);
            });
          }
        };
        objectToIterateOn = !includePrototype ? schema : _.extend(schema, valueProto);
        if (evaluateMethods) {
          return recursiveEval(objectToIterateOn);
        } else {
          return JSON.parse(JSON.stringify(objectToIterateOn));
        }
      };
      methods = {
        id: getId,
        toJSON: getId,
        schema: function(includePrototype, evaluateMethods) {
          var base;
          if (includePrototype == null) {
            includePrototype = true;
          }
          if (evaluateMethods == null) {
            evaluateMethods = true;
          }
          base = valueIsObject ? descriptor : {
            _id: identifier
          };
          return evaluateSchema(base, includePrototype, evaluateMethods);
        },
        key: function() {
          return enumName;
        },
        describe: function() {
          var prop;
          return enumName + ":" + identifier + (valueIsObject ? "  {" + ((function() {
            var ref, results;
            ref = _.extend({}, descriptor, valueProto);
            results = [];
            for (enumName in ref) {
              prop = ref[enumName];
              if (!(_.isFunction(prop))) {
                results.push(enumName + ":" + prop);
              }
            }
            return results;
          })()) + "}" : "");
        }
      };
      testReserved = function(object) {
        var field, results;
        results = [];
        for (field in object) {
          if (indexOf.call(_.keys(_.extend({}, methods, enumerationProto)), field) >= 0) {
            throw "Reserved field " + field + " cannot be passed as enum property";
          }
        }
        return results;
      };
      testReserved(valueProto);
      prototype = _.extend(methods, valueProto);
      properties = {};
      prototype.__proto__ = enumerationProto;
      defineReadOnlyProperty = function(key0, value0) {
        return properties[key0] = {
          value: value0,
          enumerable: true
        };
      };
      if (_.isObject(descriptor)) {
        testReserved(descriptor);
        if (descriptor._id == null) {
          throw "field '_id' must be defined when passing object as enum constant";
        }
        if (_.isObject(descriptor._id)) {
          throw "_id descriptor field must be of type string or number";
        }
        for (key1 in descriptor) {
          val1 = descriptor[key1];
          if (key1 !== '_id') {
            defineReadOnlyProperty(key1, val1);
          }
        }
      }
      thatConstant = Object.freeze(Object.create(prototype, properties));
      return thatConstant;
    };
    Enumeration = (function() {

      /**
      * @return {array} an array containing all the registered enumTypes
       */
      Enumeration.list = function() {
        return _.clone(enumTypes);
      };


      /*
      * alias to Enumeration.list
       */

      Enumeration.types = Enumeration.list;


      /**
      * @param  {string}  enumType A string identifying the type of this Enumeration instance
      * @param  {object}  enumValues an object which keys are the enum names, and values are each enum descriptor.
      * A descriptor can be a single unique identifier (string or number),  or an object whose fields will be copied on the enum constant instance. In this case
      * a field '_id' must be provided identifying this enum constant.
      * @param  {object} proto [optional] a prototype each enum constant will inherit from
       */

      function Enumeration(enumType, enumValues, proto) {
        var idToKeyMap, ids, key, self, val, writeProperty;
        if (proto == null) {
          proto = {};
        }
        idToKeyMap = _.object(_.map(enumValues, function(key, value) {
          return [key._id || key, value];
        }));
        self = function() {
          return self.pretty();
        };
        ids = [];
        if (!_.isString(enumType)) {
          throw "missing or bad enumType value : must be a string";
        }
        if (!_.isObject(enumValues) || _.isArray(enumValues)) {
          throw "missing or bad enumValues : must be an object";
        }
        if (indexOf.call(enumTypes, enumType) >= 0) {
          throw enumType + " already exists!";
        } else {
          if (((function() {
            var i, len, ref, results;
            ref = _.keys(enumValues);
            results = [];
            for (i = 0, len = ref.length; i < len; i++) {
              key = ref[i];
              if (key === "pretty" || key === "from" || key === "toJSON" || key === "assertScheme" || key === "type") {
                results.push(key);
              }
            }
            return results;
          })()).length > 0) {
            throw "Cannot have enum constant as one amongst reserved enumeration property [pretty,from]";
          }
        }
        Object.defineProperty(self, "prototype", {
          value: {
            type: function() {
              return enumType;
            }
          }
        });
        writeProperty = (function(_this) {
          return function(descriptor, key) {
            return Object.defineProperty(self, key, {
              value: constant(key, descriptor, proto, ids, self.prototype),
              enumerable: true
            });
          };
        })(this);
        for (key in enumValues) {
          val = enumValues[key];
          writeProperty(val, key);
        }
        Object.defineProperty(self, 'pretty', {
          value: function(evalConstantsMethods) {
            if (evalConstantsMethods == null) {
              evalConstantsMethods = false;
            }
            return JSON.stringify(self.toJSON(true, evalConstantsMethods), null, 2);
          }
        });
        Object.defineProperty(self, 'prettyPrint', {
          value: function(evalConstantsMethods) {
            if (evalConstantsMethods == null) {
              evalConstantsMethods = false;
            }
            return console.log(self.toJSON(true, evalConstantsMethods));
          }
        });
        Object.defineProperty(self, 'from', {
          value: function(identifier, throwOnFailure) {
            if (throwOnFailure == null) {
              throwOnFailure = false;
            }
            return self[idToKeyMap[identifier]] || ((function() {
              if (throwOnFailure) {
                throw "identifier " + identifier + " does not match any";
              }
            })());
          }
        });
        Object.defineProperty(self, 'toJSON', {
          value: function(includeConstantsPrototype, evalConstantsMethods) {
            if (includeConstantsPrototype == null) {
              includeConstantsPrototype = false;
            }
            if (evalConstantsMethods == null) {
              evalConstantsMethods = false;
            }
            return _.extend({
              type: enumType
            }, mapObject(_.pick(self, _.keys(enumValues)), function(val) {
              return val.schema(includeConstantsPrototype, evalConstantsMethods);
            }));
          }
        });
        Object.defineProperty(self, 'type', {
          value: enumType
        });
        Object.defineProperty(self, 'assertSchema', {
          value: function(schemaString, strict, providedType) {
            var id, localSchema, remoteShema;
            if (strict == null) {
              strict = true;
            }
            if (providedType == null) {
              providedType = null;
            }
            'use strict';
            if (!_.isString(schemaString)) {
              throw new TypeError("first argument must be a string");
            }
            remoteShema = JSON.parse(schemaString);
            localSchema = self.toJSON();
            if (providedType != null) {
              remoteShema.type = providedType;
            }
            if (remoteShema.type !== localSchema.type) {
              throw new Error("Assertion failed. Local schema type differs from remote schema type.");
            }
            if (strict) {
              if (!_.isEqual(localSchema, remoteShema)) {
                throw new Error("Assertion failed. Local schema differs from remote schema.");
              }
            } else {
              id = function(val) {
                return val._id;
              };
              if (!(_.isEqual(mapObject(remoteShema, id), mapObject(self.toJSON(), id)))) {
                throw new Error("Assertion failed. Local schema differs from remote schema.");
              }
            }
            return true;
          }
        });
        enumTypes.push(enumType);
        return self;
      }

      return Enumeration;

    })();
    return Enumeration;
  });

}).call(this);
