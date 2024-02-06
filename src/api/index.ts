import * as statusRepository from './repositories/statusRepository/statusRepository.api';
import * as cliRepository from './repositories/cliRepository/cliRepository.api';

export const api = {
    cliRepository,
    statusRepository
};

export * from './repositories/cliRepository/cliRepository.api.types';
export * from './repositories/statusRepository/statusRepository.api.types';
