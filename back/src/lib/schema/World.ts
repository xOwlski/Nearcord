import Joi from 'joi';

export const NearCallbackSchema = Joi.object({
  signature: Joi.string().min(120).max(140).required(),
  accountId: Joi.string().min(2).max(64).required(),
  publicKey: Joi.string().min(45).max(55).required(),
}).strict();
