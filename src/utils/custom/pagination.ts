import { RequestParamsDto } from '../shared/dataTransferObjects';

export function getPageParams(params?: RequestParamsDto | null) {
  if (!params) {
    return { skip: 0, pageSize: 20 };
  }

  const pageSize = params.pageSize ?? 20;
  const pageNumber = params.pageNumber ?? 1;

  return {
    skip: (pageNumber - 1) * pageSize,
    pageSize,
  };
}
