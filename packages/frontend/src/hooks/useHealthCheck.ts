import { useQuery } from '@tanstack/react-query';
import { healthCheck } from '../services/api';

export const useHealthCheck = () => {
  return useQuery({
    queryKey: ['health'],
    queryFn: healthCheck,
    refetchInterval: 60000,
  });
};
