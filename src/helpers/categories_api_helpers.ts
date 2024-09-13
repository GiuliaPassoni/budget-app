import { addDoc, collection, getDocs } from 'firebase/firestore';
import { currentUser, db } from '~/firebase';
import { toast } from 'solid-toast';
import { CategoryI } from '~/helpers/types';

interface PropsI {
  category: CategoryI;
  //   todo: should there be a MethodType entry here, to distinguish the categories?
}

export async function addNewCategory(props: PropsI) {
  try {
    await addDoc(collection(db, 'users', currentUser(), 'categories'), {
      ...props.category,
      user_id: currentUser(),
    });
    toast.success('New category added');
  } catch (e) {
    console.error('Error adding category: ', e);
    toast.error('Error adding category');
  }
}

export async function getCategories() {
  try {
    let allCategories: CategoryI[] = [];
    const querySnapshot = await getDocs(
      collection(db, 'users', currentUser(), 'categories'),
    );
    querySnapshot.forEach((doc) => {
      const data = doc.data() as CategoryI; // Type assertion
      allCategories.push(data);
    });
    return allCategories;
  } catch (e) {
    console.error(
      'Error retrieving categories: ',
      e instanceof Error ? e.message : e,
    );
  }
}
