import { doc, getDoc, setDoc } from 'firebase/firestore'
import { db } from 'src/boot'

export interface Project {
  id: string
  name: string
}

export async function getProjects(userId: string): Promise<Project[]> {
  const projectRef = doc(db, 'users', userId, 'projects')
  const projectsSnap = await getDoc(projectRef)

  return projectsSnap.data() as Project[]
}

export async function getProject(userId: string, id: string): Promise<Project> {
  const projectRef = doc(db, 'users', userId, 'projects', id)
  const projectSnap = await getDoc(projectRef)

  return projectSnap.data() as Project
}

export async function setProject(userId: string, id: string, name: string): Promise<void> {
  return setDoc(doc(db, 'users', userId, 'projects', id), {
    id,
    name,
  })
}
