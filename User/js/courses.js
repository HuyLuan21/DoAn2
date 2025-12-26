import { getAllCourses, getCourseById } from '../../src/database/courses.db.js'
import { getAllLanguages } from '../../src/database/language.db.js'
import { getAllLanguageLevels } from '../../src/database/language_level.db.js'

// ==================== STATE MANAGEMENT ====================
let allCourses = []
let filteredCourses = []
let languageMap = {} // Will be populated from database
let levelMap = {} // Will be populated from database

// ==================== UTILITY FUNCTIONS ====================

/**
 * Format currency to Vietnamese Dong
 */
function formatCurrency(amount) {
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
    }).format(amount)
}

/**
 * Build language map from database
 */
function buildLanguageMap() {
    const languages = getAllLanguages() || []
    languageMap = {}
    languages.forEach(lang => {
        languageMap[lang.languageCode] = lang.languageName
    })
}

/**
 * Build level map from database
 */
function buildLevelMap() {
    const levels = getAllLanguageLevels() || []
    levelMap = {}
    levels.forEach(level => {
        levelMap[level.levelOrder] = level.levelName
    })
}

/**
 * Get language name from code
 */
function getLanguageName(code) {
    return languageMap[code] || code
}

/**
 * Get level name from order
 */
function getLevelName(level) {
    return levelMap[level] || `Level ${level}`
}

// ==================== RENDER FUNCTIONS ====================

/**
 * Create a single course card HTML
 */
function createCourseCard(course) {
    return `
        <div class="course-card" data-course-id="${course.courseId}">
            <div class="course-card__image">
                <img src="${course.imgUrl}" alt="${course.courseName}">
                <div class="course-card__badge">${getLanguageName(course.languageCode)}</div>
            </div>
            <div class="course-card__content">
                <h3 class="course-card__title">${course.courseName}</h3>
                <p class="course-card__description">${course.description}</p>
                <div class="course-card__meta">
                    <div class="course-card__meta-item">
                        <i class="fas fa-clock"></i>
                        <span>${course.duration}</span>
                    </div>
                    <div class="course-card__meta-item">
                        <i class="fas fa-signal"></i>
                        <span>${getLevelName(course.inputLevel)}</span>
                    </div>
                </div>
            </div>
            <div class="course-card__footer">
                <div class="course-card__price">${formatCurrency(course.tuitionFee)}</div>
                <button class="course-card__button">Xem chi tiết</button>
            </div>
        </div>
    `
}

/**
 * Render all courses to the grid
 */
function renderCourses(courses) {
    const coursesGrid = document.getElementById('coursesGrid')
    const emptyState = document.getElementById('emptyState')

    if (!courses || courses.length === 0) {
        coursesGrid.style.display = 'none'
        emptyState.style.display = 'block'
        return
    }

    coursesGrid.style.display = 'grid'
    emptyState.style.display = 'none'
    coursesGrid.innerHTML = courses.map(createCourseCard).join('')

    // Add click event listeners to cards
    attachCardClickEvents()
}

/**
 * Attach click events to course cards
 */
function attachCardClickEvents() {
    const cards = document.querySelectorAll('.course-card')
    cards.forEach(card => {
        card.addEventListener('click', e => {
            const courseId = card.dataset.courseId
            // Navigate to course detail page
            window.location.href = `course-detail.html?id=${courseId}`
        })
    })
}

// ==================== FILTER & SEARCH FUNCTIONS ====================

/**
 * Apply all filters and search
 */
function applyFilters() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase().trim()
    const languageFilter = document.getElementById('languageFilter').value
    const levelFilter = document.getElementById('levelFilter').value
    const sortFilter = document.getElementById('sortFilter').value

    // Start with all courses
    filteredCourses = [...allCourses]

    // Apply search filter
    if (searchTerm) {
        filteredCourses = filteredCourses.filter(
            course =>
                course.courseName.toLowerCase().includes(searchTerm) ||
                course.description.toLowerCase().includes(searchTerm)
        )
    }

    // Apply language filter
    if (languageFilter !== 'all') {
        filteredCourses = filteredCourses.filter(course => course.languageCode === languageFilter)
    }

    // Apply level filter
    if (levelFilter !== 'all') {
        filteredCourses = filteredCourses.filter(course => course.inputLevel === parseInt(levelFilter))
    }

    // Apply sorting
    applySorting(sortFilter)

    // Render filtered results
    renderCourses(filteredCourses)
}

/**
 * Apply sorting to filtered courses
 */
function applySorting(sortType) {
    switch (sortType) {
        case 'price-asc':
            filteredCourses.sort((a, b) => a.tuitionFee - b.tuitionFee)
            break
        case 'price-desc':
            filteredCourses.sort((a, b) => b.tuitionFee - a.tuitionFee)
            break
        case 'name-asc':
            filteredCourses.sort((a, b) => a.courseName.localeCompare(b.courseName))
            break
        default:
            // Keep original order
            break
    }
}

/**
 * Debounce function for search input
 */
function debounce(func, wait) {
    let timeout
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout)
            func(...args)
        }
        clearTimeout(timeout)
        timeout = setTimeout(later, wait)
    }
}

// ==================== EVENT LISTENERS ====================

/**
 * Initialize event listeners
 */
function initEventListeners() {
    // Search input with debounce
    const searchInput = document.getElementById('searchInput')
    searchInput.addEventListener('input', debounce(applyFilters, 300))

    // Filter selects
    const languageFilter = document.getElementById('languageFilter')
    const levelFilter = document.getElementById('levelFilter')
    const sortFilter = document.getElementById('sortFilter')

    languageFilter.addEventListener('change', applyFilters)
    levelFilter.addEventListener('change', applyFilters)
    sortFilter.addEventListener('change', applyFilters)
}

// ==================== INITIALIZATION ====================

/**
 * Populate filter options from database
 */
function populateFilterOptions() {
    // Populate language filter
    const languageFilter = document.getElementById('languageFilter')
    const languages = getAllLanguages() || []

    // Keep the "All" option and add dynamic options
    languages.forEach(lang => {
        const option = document.createElement('option')
        option.value = lang.languageCode
        option.textContent = lang.languageName
        languageFilter.appendChild(option)
    })

    // Populate level filter
    const levelFilter = document.getElementById('levelFilter')
    const levels = getAllLanguageLevels() || []

    // Get unique levels by levelOrder
    const uniqueLevels = Array.from(new Map(levels.map(l => [l.levelOrder, l])).values())

    uniqueLevels.sort((a, b) => a.levelOrder - b.levelOrder)
    uniqueLevels.forEach(level => {
        const option = document.createElement('option')
        option.value = level.levelOrder
        option.textContent = level.levelName
        levelFilter.appendChild(option)
    })
}

/**
 * Initialize the courses page
 */
function init() {
    // Build lookup maps from database
    buildLanguageMap()
    buildLevelMap()

    // Load courses from database
    allCourses = getAllCourses() || []
    filteredCourses = [...allCourses]

    // Populate filter options dynamically
    populateFilterOptions()

    // Render initial courses
    renderCourses(filteredCourses)

    // Setup event listeners
    initEventListeners()

    console.log(`Loaded ${allCourses.length} courses`)
}

// ==================== START APPLICATION ====================

// Wait for DOM to be ready
document.addEventListener('DOMContentLoaded', init)
