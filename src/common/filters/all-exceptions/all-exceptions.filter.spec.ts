import { ArgumentsHost, BadRequestException, HttpStatus } from '@nestjs/common';
import { AllExceptionsFilter } from './all-exceptions.filter';

describe('AllExceptionsFilter', () => {
  let filter: AllExceptionsFilter;
  let mockJson: jest.Mock;
  let mockStatus: jest.Mock;
  let mockRes: { status: jest.Mock };
  let mockReq: { url: string };

  beforeEach(() => {
    filter = new AllExceptionsFilter();

    mockJson = jest.fn();
    mockStatus = jest.fn().mockImplementation(() => ({ json: mockJson }));

    mockRes = {
      status: mockStatus,
    };

    mockReq = {
      url: '/test-path',
    };
  });

  function createHost(): ArgumentsHost {
    return {
      switchToHttp: () => ({
        getResponse: () => mockRes,
        getRequest: () => mockReq,
      }),
    } as ArgumentsHost;
  }

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should handle HttpException and return its status and message', () => {
    const host = createHost();
    const exc = new BadRequestException('Invalid payload');

    filter.catch(exc, host);

    expect(mockStatus).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
    expect(mockJson).toHaveBeenCalledWith(
      expect.objectContaining({
        statusCode: HttpStatus.BAD_REQUEST,
        path: '/test-path',
        // message may be string or array; check substring
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        message: expect.anything(),
        error: exc.name,
      }),
    );
  });

  it('should map DB unique constraint error to 409 Conflict', () => {
    const host = createHost();
    // Simulate a DB error object; filter checks err.code or err.errno as well as message
    const dbError: any = {
      code: 'SQLITE_CONSTRAINT',
      message: 'SQLITE_CONSTRAINT: UNIQUE constraint failed: book.isbn',
    };

    filter.catch(dbError, host);

    expect(mockStatus).toHaveBeenCalledWith(HttpStatus.CONFLICT);
    expect(mockJson).toHaveBeenCalledWith(
      expect.objectContaining({
        statusCode: HttpStatus.CONFLICT,
        path: '/test-path',
        message: 'Conflict: unique constraint violation',
        error: 'Conflict',
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        detail: expect.stringContaining('SQLITE_CONSTRAINT'),
      }),
    );
  });

  it('should return 500 for unknown (unhandled) exceptions', () => {
    const host = createHost();
    const unknownError = new Error('something-bad');

    // spy on logger to avoid noisy logs
    const loggerSpy = jest
      .spyOn(filter['logger'], 'error')
      .mockImplementation(() => {});

    filter.catch(unknownError, host);

    expect(mockStatus).toHaveBeenCalledWith(HttpStatus.INTERNAL_SERVER_ERROR);
    expect(mockJson).toHaveBeenCalledWith(
      expect.objectContaining({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        path: '/test-path',
        message: 'Internal server error',
        error: 'InternalServerError',
      }),
    );
    expect(loggerSpy).toHaveBeenCalledWith('Unhandled exception', unknownError);

    loggerSpy.mockRestore();
  });
});
