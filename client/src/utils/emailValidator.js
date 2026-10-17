/**
 * Christ University Email Validation Utilities
 * Faculty Template: xxx@christuniversity.in
 * Student Template: xxx@<course_name>.christuniversity.in
 */

export const FACULTY_REGEX = /^[a-zA-Z0-9._%+-]+@christuniversity\.in$/i;
export const STUDENT_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.christuniversity\.in$/i;

export function evaluateEmailDomain(email) {
  if (!email || typeof email !== 'string') {
    return {
      isValidChrist: false,
      isFaculty: false,
      isStudent: false,
      course: null,
      warning: null,
    };
  }

  const clean = email.trim().toLowerCase();

  if (FACULTY_REGEX.test(clean)) {
    return {
      isValidChrist: true,
      isFaculty: true,
      isStudent: false,
      course: null,
      typeLabel: 'Christ Faculty Account',
      badgeClass: 'bg-blue-50 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300 border border-blue-200 dark:border-blue-800',
      warning: null,
    };
  }

  if (STUDENT_REGEX.test(clean)) {
    const parts = clean.split('@');
    const domainParts = parts[1].split('.');
    // domainParts = ['mca', 'christuniversity', 'in']
    const course = domainParts.length > 2 ? domainParts[0].toUpperCase() : 'Student';

    return {
      isValidChrist: true,
      isFaculty: false,
      isStudent: true,
      course,
      typeLabel: `Christ Student Account (${course})`,
      badgeClass: 'bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300 border border-blue-300 dark:border-blue-700',
      warning: null,
    };
  }

  // Not matching Christ University format
  return {
    isValidChrist: false,
    isFaculty: false,
    isStudent: false,
    course: null,
    typeLabel: 'External Email',
    badgeClass: 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-300 dark:border-amber-700',
    warning:
      'Warning: This email does not match official Christ University formats. Official submissions require an institutional email (Faculty: name@christuniversity.in | Students: name@course.christuniversity.in). Demo access is permitted with non-official status.',
  };
}
