import { addDoc, collection } from 'firebase/firestore';
import { toast } from 'solid-toast';
import { db } from '~/firebase';

type Props = {
  user: any;
};

export default async function addUser({ user }: Props) {
  try {
    const docRef = await addDoc(collection(db, 'users'), {
      auth_uid: user.uid,
      email: user.email,
    });
    toast.success('user in db');
    console.debug('Document written with ID: ', docRef.id);
  } catch (e) {
    console.error('Error adding user: ', e);
    toast.error('Error adding user to db');
  }
}
