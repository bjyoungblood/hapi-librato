import Joi from 'joi';
import Hoek from 'hoek';
import pkg from '../package.json';

const optionsSchema = Joi.object().keys({
  librato : Joi.object().required(),
  responseTimeKey : Joi.string().optional().default('responseTime'),
  requestCountKey : Joi.string().optional().default('requestCount'),
}).options({
  allowUnknown : true,
  stripUnknown : true,
});

function register(server, options, next) {

  let valid = Joi.validate(options, optionsSchema);
  if (valid.error) {
    next(valid.error);
    return;
  }

  options = valid.value;

  let librato = options.librato;

  server.ext('onRequest', function(request, reply) {
    request.plugins.librato = {
      startTime : Date.now(),
    };

    reply.continue();
  });

  server.on('response', function(request) {
    let source = Hoek.reach(request, 'route.settings.id', void 0);

    let time = Hoek.reach(request, 'plugins.librato.startTime', null);
    if (time) {
      librato.measure(options.responseTimeKey, Date.now() - time, { source });
    }

    librato.increment(options.requestCountKey, { source });
  });

  next();

}

register.attributes = {
  name : pkg.name,
  version : pkg.version,
  multiple : false,
};

export default register;
