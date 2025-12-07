import mockLanguageLevels from '../mocks/languageLevels.js'

const LANGUAGE_LEVEL_KEY = 'language_levels'

function getLanguageLevelList() {
    return JSON.parse(localStorage.getItem(LANGUAGE_LEVEL_KEY))
}

function saveLanguageLevelList(list) {
    localStorage.setItem(LANGUAGE_LEVEL_KEY, JSON.stringify(list))
}

function initLanguageLevelDB() {
    const existing = getLanguageLevelList()
    if (!existing) {
        saveLanguageLevelList(mockLanguageLevels)
    }
}
initLanguageLevelDB()

export function getAllLanguageLevels() {
    return getLanguageLevelList()
}

export function getLanguageLevelById(id) {
    const languageLevels = getLanguageLevelList()
    return languageLevels.find(ll => ll.id === id)
}

export function addLanguageLevel(languageLevel) {
    const languageLevels = getLanguageLevelList()
    const newId = languageLevels.length > 0 ? Math.max(...languageLevels.map(ll => ll.id)) + 1 : 1
    const newLanguageLevel = { id: newId, ...languageLevel }
    languageLevels.push(newLanguageLevel)
    saveLanguageLevelList(languageLevels)

    return newLanguageLevel
}

export function updateLanguageLevel(id, updatedInfo) {
    const languageLevels = getLanguageLevelList()

    const index = languageLevels.findIndex(ll => ll.id === id)
    if (index === -1) {
        return null
    }
    languageLevels[index] = { ...languageLevels[index], ...updatedInfo }
    saveLanguageLevelList(languageLevels)
    return languageLevels[index]
}

export function deleteLanguageLevel(id) {
    const languageLevels = getLanguageLevelList()

    const index = languageLevels.findIndex(ll => ll.id === id)
    if (index === -1) {
        return false
    }
    languageLevels.splice(index, 1)
    saveLanguageLevelList(languageLevels)
    return true
}
