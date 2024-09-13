import { setDoc, doc } from 'firebase/firestore';
import { toast } from 'solid-toast';
import { db } from '~/firebase';

type Props = {
  user: any;
};

export default async function addUser({ user }: Props) {
  try {
    await setDoc(doc(db, 'users', user.uid), {
      auth_uid: user.uid,
      email: user.email,
    });
    toast.success('User added to db');
  } catch (e) {
    console.error('Error adding user: ', e);
    toast.error('Error adding user to db');
  }
}
