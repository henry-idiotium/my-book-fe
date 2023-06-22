import { PageMeta } from '@/components';

export function Friends() {
  return (
    <PageMeta title="Friends" auth={{ type: 'private' }}>
      <div>This is Friends page!!</div>
    </PageMeta>
  );
}
export default Friends;
