export interface SampleActivityInput {
  name: string;
}

export async function sampleActivity(input: SampleActivityInput) {
  return input;
}
