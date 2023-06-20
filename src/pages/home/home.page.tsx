import { usePageMeta } from '@/hooks';

export function Home() {
  usePageMeta({ title: 'Home', auth: { type: 'custom' } });

  return (
    <div className="">
      <div className="h-80" />
    </div>
  );
}

export default Home;
