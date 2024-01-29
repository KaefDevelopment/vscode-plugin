import * as statusRepository from './repositories/statusRepository/statusRepository.api';
import * as cliRepository from './repositories/cliRepository/cliRepository.api';

export const api = {
    statusRepository,
    cliRepository
};

export * from './repositories/statusRepository/statusRepository.api.types';
