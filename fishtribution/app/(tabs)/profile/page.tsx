import ProfileView, { type Profile } from '@/components/ProfileView'

// TODO: replace with real data from the database
const placeholderProfile: Profile = {
  username: 'xXx_betta_xXx',
  email: 'username@mail.com',
  location: 'Anywhere, AYW',
  avatar_url: null,
}

export default function ProfilePage() {
  return <ProfileView profile={placeholderProfile} />
}