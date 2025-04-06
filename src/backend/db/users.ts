import { doc, getDoc, setDoc } from 'firebase/firestore'
import { db } from 'src/boot'

export interface User {
  id: string
  name: string
}

export async function getUser(id: string) {
  const userRef = doc(db, 'users', id)
  const userSnap = await getDoc(userRef)

  return userSnap.data() as User
}

export async function setUser(id: string, name: string) {
  return setDoc(doc(db, 'users', id), {
    id,
    name,
  })
}
