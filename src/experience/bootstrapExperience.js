import { createExperienceRuntime } from './createExperienceRuntime'
import { loadExperienceModules } from './loadExperienceModules'

export async function bootstrapExperience({ motion, scopeElement, heroProjects }) {
  try {
    const modules = await loadExperienceModules()

    const runtime = createExperienceRuntime({
      modules,
      motion,
      scopeElement,
      heroProjects,
    })

    if (import.meta.hot) {
      import.meta.hot.dispose(() => {
        runtime?.destroy()
      })
    }
  } catch (error) {
    console.error('Failed to bootstrap motion experience:', error)
    document.body.classList.add('motion-disabled')
  }
}
