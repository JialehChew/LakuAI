import { EngineInput, ProductIdentity } from '../types';

/**
 * Architecture for Subject Extraction and Normalization.
 * In a production environment, this would call specialized background-removal models.
 */
export interface IsolationStep {
  id: string;
  name: string;
  action: 'detect' | 'crop' | 'remove_bg' | 'normalize';
  status: 'pending' | 'completed';
}

export function createIsolationPipeline(input: EngineInput, identity: ProductIdentity): IsolationStep[] {
  return [
    { id: '1', name: 'Detecting Main Product', action: 'detect', status: 'pending' },
    { id: '2', name: 'Smart Cropping to 1:1', action: 'crop', status: 'pending' },
    { id: '3', name: 'Isolating Subject from Clutter', action: 'remove_bg', status: 'pending' },
    { id: '4', name: 'Normalizing Lighting Levels', action: 'normalize', status: 'pending' }
  ];
}
