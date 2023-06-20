import { usePageMeta } from '@/hooks';

export function Friends() {
  usePageMeta({ title: 'Friends', auth: { type: 'private' } });

  return <>This is Friends page!!</>;
}
export default Friends;
