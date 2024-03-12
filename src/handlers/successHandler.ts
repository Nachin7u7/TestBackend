import { Response } from 'express';
import { HTTP_STATUS } from '../constants';

/**
 * Envía una respuesta HTTP de éxito.
 * @param res Objeto de respuesta Express.
 * @param data Datos a enviar en la respuesta.
 * @param message Mensaje a enviar en la respuesta.
 * @param statusCode Código de estado HTTP, por defecto 200 (OK).
 */
const sendOkResponse = (
  res: Response,
  data: any,
  message: string,
  statusCode: number = HTTP_STATUS.OK
) => {
  res.status(statusCode).json({
    success: true,
    result: data,
    message,
  });
};

/**
 * Envía una respuesta HTTP indicando que un recurso fue creado exitosamente.
 * @param res Objeto de respuesta Express.
 * @param message Mensaje a enviar en la respuesta.
 * @param data Datos a enviar en la respuesta.
 */
const sendCreatedResponse = (
  res: Response,
  message: string,
  data: any
): void => {
  res.status(HTTP_STATUS.CREATED).json({
    success: true,
    result: data,
    message,
  });
};

export { sendOkResponse, sendCreatedResponse };
