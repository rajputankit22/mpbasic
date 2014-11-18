// Generated by CoffeeScript 1.6.3
(function() {
  var colors, extend, fallbackCnf, _,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    __slice = [].slice;

  _ = require('lodash')._;

  extend = require('extend');

  colors = require('colors');

  fallbackCnf = {
    get: function(name, logging) {
      var _cnf;
      if (logging == null) {
        logging = false;
      }
      _cnf = {};
      if (logging) {
        logging = {
          logging: {
            severity: process.env["severity_" + name] || this.severity,
            severitys: "fatal,error,warning,info,debug".split(",")
          }
        };
        return extend(true, {}, logging, _cnf);
      } else {
        return _cnf;
      }
    }
  };

  module.exports = function(config) {
    var Basic;
    if (config == null) {
      config = fallbackCnf;
    }
    return Basic = (function(_super) {
      __extends(Basic, _super);

      Basic.prototype.extend = extend;

      Basic.prototype.defaults = function() {
        return {};
      };

      /*	
      		## constructor 
      
      		`new Baisc( options )`
      		
      		Basic constructor. Define the configuration by options and defaults, init logging and init the error handler
      
      		@param {Object} options Basic config object
      */


      function Basic(options) {
        if (options == null) {
          options = {};
        }
        this.ERRORS = __bind(this.ERRORS, this);
        this._initErrors = __bind(this._initErrors, this);
        this._checkLogging = __bind(this._checkLogging, this);
        this.debug = __bind(this.debug, this);
        this.info = __bind(this.info, this);
        this.warning = __bind(this.warning, this);
        this.error = __bind(this.error, this);
        this.fatal = __bind(this.fatal, this);
        this._logname = __bind(this._logname, this);
        this._log = __bind(this._log, this);
        this.log = __bind(this.log, this);
        this._handleError = __bind(this._handleError, this);
        this._waitUntil = __bind(this._waitUntil, this);
        this.setter = __bind(this.setter, this);
        this.getter = __bind(this.getter, this);
        this.define = __bind(this.define, this);
        this.initialize = __bind(this.initialize, this);
        this.mixin = __bind(this.mixin, this);
        this.defaults = __bind(this.defaults, this);
        this.on("_log", this._log);
        this.getter("classname", function() {
          return this.constructor.name.toLowerCase();
        });
        this.config = extend(true, {}, this.defaults(), config.get(this._config_name || this.classname, true), options);
        this._initErrors();
        this.initialize(options);
        this.debug("loaded");
        return;
      }

      /*
      		## mixin
      		
      		`mpbasic.mixin( mixins... )`
      		
      		Method to include other class methods to this class.		
      
      		@param { Class } mixins... One or more classes as arguments 
      		
      		@api public
      */


      Basic.prototype.mixin = function() {
        var fn, mixins, mxn, _fnname, _i, _len, _ref;
        mixins = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
        if (mixins != null ? mixins.length : void 0) {
          for (_i = 0, _len = mixins.length; _i < _len; _i++) {
            mxn = mixins[_i];
            _ref = mxn.prototype;
            for (_fnname in _ref) {
              fn = _ref[_fnname];
              if (_fnname !== "constructor") {
                this[_fnname] = fn;
              }
            }
          }
        }
      };

      /*
      		## initialize
      		
      		`basic.initialize()`
      		
      		Overwritible Method to initialize the module
      
      		@param {Object} options Basic config object passed to constructor
      		
      		@api public
      */


      Basic.prototype.initialize = function(options) {};

      /*
      		## define
      		
      		`basic.define( prop, fnGet [, fnSet] )`
      		
      		Helper to define getter and setter methods fot a property
      		
      		@param { String } prop Property name 
      		@param { Function|Object } fnGet Get method or a object with `get` and `set` 
      		@param { Function } [fnSet] Set method
      
      		@api public
      */


      Basic.prototype.define = function(prop, fnGet, fnSet, writable, enumerable) {
        var _oGetSet;
        if (writable == null) {
          writable = true;
        }
        if (enumerable == null) {
          enumerable = true;
        }
        _oGetSet = {
          enumerable: enumerable,
          writable: writable
        };
        if (_.isFunction(fnGet)) {
          _oGetSet = {
            get: fnGet
          };
          if ((fnSet != null) && _.isFunction(fnSet)) {
            _oGetSet.set = fnSet;
          }
        } else {
          _oGetSet.value = fnGet;
        }
        Object.defineProperty(this, prop, _oGetSet);
      };

      /*
      		## getter
      		
      		`basic.getter( prop, fnGet )`
      		
      		Shortcut to define a getter
      		
      		@param { String } prop Property name 
      		@param { Function } fnGet Get method 
      		
      		@api public
      */


      Basic.prototype.getter = function(prop, _get, enumerable) {
        var _obj;
        if (enumerable == null) {
          enumerable = true;
        }
        _obj = {
          enumerable: enumerable
        };
        if (_.isFunction(_get)) {
          _obj.get = _get;
        } else {
          _obj.value = _get;
        }
        Object.defineProperty(this, prop, _obj);
      };

      /*
      		## setter
      		
      		`basic.setter( prop, fnSet )`
      		
      		Shortcut to define a setter
      		
      		@param { String } prop Property name 
      		@param { Function } fnSet Get method 
      		
      		@api public
      */


      Basic.prototype.setter = function(prop, fnGet, enumerable) {
        if (enumerable == null) {
          enumerable = true;
        }
        Object.defineProperty(this, prop, {
          set: fnGet,
          enumerable: enumerable,
          writable: true
        });
      };

      /*
      		## _waitUntil
      		
      		`basic._waitUntil( method[, key][, context] )`
      		
      		Wrapper method to create a methos thas is only called until the `@{key}`is true or an event `{key}` has bin emitted.
      		Usually this is used to generate a method that will wait until the modules/class is ready.
      		
      		@param { Function } method The function to call.
      		@param { String } [ key="ready" ] the key to listen for.
      		@param { Context } [context={self}] The context to lsiten to the key. Per default it is the instance it self `@` or `this`.
      		
      		@api public
      */


      Basic.prototype._waitUntil = function(method, key, context) {
        var _this = this;
        if (key == null) {
          key = "ready";
        }
        if (context == null) {
          context = this;
        }
        return function() {
          var args;
          args = arguments;
          if (context[key]) {
            method.apply(_this, args);
          } else {
            context.once(key, function() {
              method.apply(_this, args);
            });
          }
        };
      };

      /*
      		## _handleError
      		
      		`basic._handleError( cb, err [, data] )`
      		
      		Baisc error handler. It creates a true error object and returns it to the callback, logs it or throws the error hard
      		
      		@param { Function|String } cb Callback function or NAme to send it to the logger as error 
      		@param { String|Error|Object } err Error type, Obejct or real error object
      		
      		@api private
      */


      Basic.prototype._handleError = function(cb, err, data, errExnd) {
        var _base, _err, _k, _ref, _ref1, _v;
        if (data == null) {
          data = {};
        }
        if (_.isString(err)) {
          _err = new Error();
          _err.name = err;
          _err.message = ((_ref = this._ERRORS) != null ? typeof (_base = _ref[err])[1] === "function" ? _base[1](data) : void 0 : void 0) || "unkown";
          _err.statusCode = ((_ref1 = this._ERRORS) != null ? _ref1[err][0] : void 0) || 500;
          _err.customError = true;
        } else {
          _err = err;
        }
        if (errExnd != null) {
          _err.data = errExnd;
        }
        for (_k in data) {
          _v = data[_k];
          _err[_k] = _v;
        }
        if (_.isFunction(cb)) {
          cb(_err);
        } else if (_.isString(cb)) {
          this.log("error", cb, _err);
        } else if (cb === true) {
          return _err;
        } else {
          throw _err;
        }
        return _err;
      };

      /*
      		## log
      		
      		`base.log( severity, code [, content1, content2, ... ] )`
      		
      		write a log to the console if the current severity matches the message severity
      		
      		@param { String } severity Message severity
      		@param { String } code Simple code the describe/label the output
      		@param { Any } [contentN] Content to append to the log
      		
      		@api public
      */


      Basic.prototype.log = function() {
        var args, code, content, severity;
        severity = arguments[0], code = arguments[1], content = 3 <= arguments.length ? __slice.call(arguments, 2) : [];
        args = ["_log", severity, code];
        this.emit.apply(this, args.concat(content));
      };

      /*
      		## _log
      		
      		`base._log( severity, code [, content1, content2, ... ] )`
      		
      		write a log to the console if the current severity matches the message severity
      		
      		@param { String } severity Message severity
      		@param { String } code Simple code the describe/label the output
      		@param { Any } [contentN] Content to append to the log
      		
      		@api private
      */


      Basic.prototype._log = function() {
        var arg, args, code, content, severity, _c, _i, _j, _len, _len1, _tmpl;
        severity = arguments[0], code = arguments[1], content = 3 <= arguments.length ? __slice.call(arguments, 2) : [];
        if (this._checkLogging(severity)) {
          _tmpl = "%s %s - " + (new Date().toString().slice(4, 24)) + " - %s ";
          args = [_tmpl, severity.toUpperCase(), this._logname(), code];
          if (content.length) {
            args[0] += "\n";
            for (_i = 0, _len = content.length; _i < _len; _i++) {
              _c = content[_i];
              args.push(_c);
            }
          }
          switch (severity) {
            case "fatal":
              args[0] = args[0].red.bold.inverse;
              console.error.apply(console, args);
              for (_j = 0, _len1 = args.length; _j < _len1; _j++) {
                arg = args[_j];
                if (!(arg instanceof Error)) {
                  continue;
                }
                console.log(arg.stack);
                return;
              }
              console.trace();
              break;
            case "error":
              args[0] = args[0].red.bold;
              console.error.apply(console, args);
              break;
            case "warning":
              args[0] = args[0].yellow.bold;
              console.warn.apply(console, args);
              break;
            case "info":
              args[0] = args[0].blue.bold;
              console.info.apply(console, args);
              break;
            case "debug":
              args[0] = args[0].green.bold;
              console.log.apply(console, args);
              break;
          }
        }
      };

      /*
      		## _logname
      		
      		`basic._logname()`
      		
      		Helper method to overwrite the name displayed withing the console output
      		
      		@param { String }  Desc 
      		@param { Function }  Callback function 
      		
      		@return { String } Return Desc 
      		
      		@api private
      */


      Basic.prototype._logname = function() {
        return this.constructor.name;
      };

      /*
      		## fatal
      		
      		`index.fatal( code, content... )`
      		
      		Shorthand to output a **fatal** log
      		
      		@param { String } code Simple code the describe/label the output
      		@param { Any } [contentN] Content to append to the log
      		
      		@api public
      */


      Basic.prototype.fatal = function() {
        var args, code, content;
        code = arguments[0], content = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
        args = ["_log", "fatal", code];
        this.emit.apply(this, args.concat(content));
      };

      /*
      		## error
      		
      		`index.error( code, content... )`
      		
      		Shorthand to output a **error** log
      		
      		@param { String } code Simple code the describe/label the output
      		@param { Any } [contentN] Content to append to the log
      		
      		@api public
      */


      Basic.prototype.error = function() {
        var args, code, content;
        code = arguments[0], content = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
        args = ["_log", "error", code];
        this.emit.apply(this, args.concat(content));
      };

      /*
      		## warning
      		
      		`index.warning( code, content... )`
      		
      		Shorthand to output a **warning** log
      		
      		@param { String } code Simple code the describe/label the output
      		@param { Any } [contentN] Content to append to the log
      		
      		@api public
      */


      Basic.prototype.warning = function() {
        var args, code, content;
        code = arguments[0], content = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
        args = ["_log", "warning", code];
        this.emit.apply(this, args.concat(content));
      };

      /*
      		## info
      		
      		`index.info( code, content... )`
      		
      		Shorthand to output a **info** log
      		
      		@param { String } code Simple code the describe/label the output
      		@param { Any } [contentN] Content to append to the log
      		
      		@api public
      */


      Basic.prototype.info = function() {
        var args, code, content;
        code = arguments[0], content = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
        args = ["_log", "info", code];
        this.emit.apply(this, args.concat(content));
      };

      /*
      		## debug
      		
      		`index.debug( code, content... )`
      		
      		Shorthand to output a **debug** log
      		
      		@param { String } code Simple code the describe/label the output
      		@param { Any } [contentN] Content to append to the log
      		
      		@api public
      */


      Basic.prototype.debug = function() {
        var args, code, content;
        code = arguments[0], content = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
        args = ["_log", "debug", code];
        this.emit.apply(this, args.concat(content));
      };

      /*
      		## _checkLogging
      		
      		`basic._checkLogging( severity )`
      		
      		Helper to check if a log will be written to the console
      		
      		@param { String } severity Message severity
      		
      		@return { Boolean } Flag if the severity is allowed to write to the console
      		
      		@api private
      */


      Basic.prototype._checkLogging = function(severity) {
        var iServ;
        if (this._logging_iseverity == null) {
          this._logging_iseverity = this.config.logging.severitys.indexOf(this.config.logging.severity);
        }
        iServ = this.config.logging.severitys.indexOf(severity);
        if ((this.config.logging.severity != null) && iServ <= this._logging_iseverity) {
          return true;
        } else {
          return false;
        }
      };

      /*
      		## _initErrors
      		
      		`basic._initErrors(  )`
      		
      		convert error messages to underscore templates
      		
      		@api private
      */


      Basic.prototype._initErrors = function() {
        var key, msg, _ref;
        this._ERRORS = this.ERRORS();
        _ref = this._ERRORS;
        for (key in _ref) {
          msg = _ref[key];
          if (!_.isFunction(msg[1])) {
            this._ERRORS[key][1] = _.template(msg[1]);
          }
        }
      };

      /*
      		## ERRORS
      		
      		`passwordless.ERRORS()`
      		
      		Error detail mappings
      		
      		@return { Object } Return A Object of error details. Format: `"ERRORCODE":[ ststudCode, "Error detail" ]` 
      		
      		@api private
      */


      Basic.prototype.ERRORS = function() {
        return {
          "ENOTIMPLEMENTED": [501, "This function is planed but currently not implemented"]
        };
      };

      return Basic;

    })(require('events').EventEmitter);
  };

}).call(this);
