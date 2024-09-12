import { Toaster } from 'solid-toast';
import Avatar from '~/components/atoms/Avatar';
import { Show } from 'solid-js';
import { useNavigate } from '@solidjs/router';
import { handleLogOut } from '~/helpers/auth_helpers';
import { auth } from '~/firebase';
import Button from '~/components/atoms/Button';

export default function SignOutButton() {
  const user = auth.currentUser;
  const navigate = useNavigate();
  return (
    <Show when={user}>
      <Avatar
        email={user?.email}
        name={user?.displayName}
        pic={user?.photoURL}
      />
      <Button
        text="Sign out button"
        onClick={() => {
          navigate('/overview');
          handleLogOut({ userName: user?.email });
        }}
      ></Button>
      <Toaster />
    </Show>
  );
}
