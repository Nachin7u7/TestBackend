const httpMocks = require('node-mocks-http');
const {
  sendOkResponse,
  sendCreatedResponse,
} = require('../../src/handlers/successHandler');
const { HTTP_STATUS } = require('../../src/constants');

describe('Response Handlers', () => {
  it('should send a 200 OK response with the correct data', () => {
    const res = httpMocks.createResponse();
    const data = { id: 1, name: 'Test Item' };

    sendOkResponse(res, data);

    expect(res.statusCode).toBe(HTTP_STATUS.OK);
    expect(res._getJSONData()).toEqual({
      success: true,
      result: data,
    });
  });

  it('should send a 201 Created response with the correct data and message', () => {
    const res = httpMocks.createResponse();
    const data = { id: 1, name: 'New Item' };
    const message = 'Item created successfully';

    sendCreatedResponse(res, message, data);

    expect(res.statusCode).toBe(HTTP_STATUS.CREATED);
    expect(res._getJSONData()).toEqual({
      success: true,
      result: data,
      message,
    });
  });
});
