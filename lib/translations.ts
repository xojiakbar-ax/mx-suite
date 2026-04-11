export type Language = 'uz' | 'en'


export const translations = {
  uz: {
    // Common
    appName: 'MX SUITE',
    login: 'Kirish',
    logout: 'Chiqish',
    save: 'Saqlash',
    cancel: "Bekor qilish",
    delete: "O'chirish",
    edit: 'Tahrirlash',
    add: "Qo'shish",
    search: 'Qidirish',
    filter: 'Filtr',
    all: 'Hammasi',
    today: 'Bugun',
    week: 'Hafta',
    month: 'Oy',
    year: 'Yil',

    // Auth
    phoneNumber: 'Telefon raqam',
    password: 'Parol',
    forgotPassword: 'Parolni unutdingizmi?',
    loginTitle: 'Tizimga kirish',
    loginSubtitle: "Ta'lim markazingizni boshqaring",
    invalidCredentials: "Telefon raqam yoki parol noto'g'ri",

    // Dashboard
    dashboard: 'Bosh sahifa',
    overview: "Umumiy ko'rinish",
    welcomeBack: 'Xush kelibsiz',

    // Check-in
    checkIn: 'Ish boshladim',
    checkOut: 'Ishni tugatdim',
    checkInRequired: "Ish boshlash uchun 'Ish boshladim' tugmasini bosing",
    workStarted: 'Ish boshlangan',
    workEnded: 'Ish tugagan',
    lateArrival: 'Kechikish',
    penalty: 'Jarima',

    // Roles
    director: 'Direktor',
    cto: 'Texnik direktor',
    academicManager: 'Akademik menejer',
    marketingManager: 'Marketing menejer',
    administrator: 'Administrator',

    // Navigation
    employees: 'Xodimlar',
    students: "O'quvchilar",
    teachers: "O'qituvchilar",
    groups: 'Guruhlar',
    schedule: 'Jadval',
    payments: "To'lovlar",
    leads: 'Leadlar',
    campaigns: 'Kampaniyalar',
    tasks: 'Vazifalar',
    kpi: 'KPI',
    salary: 'Maosh',
    budget: 'Byudjet',
    support: "Qo'llab-quvvatlash",
    notifications: 'Bildirishnomalar',
    reports: 'Hisobotlar',
    crm: 'CRM',

    // Tasks
    taskStatus: {
      pending: 'Kutilmoqda',
      inProgress: 'Jarayonda',
      completed: 'Bajarildi',
    },
    addTask: "Vazifa qo'shish",
    taskTitle: 'Vazifa nomi',
    taskDescription: 'Tavsif',
    taskDeadline: 'Muddat',
    dailyTasks: 'Kunlik vazifalar',
    weeklyTasks: 'Haftalik vazifalar',
    monthlyTasks: 'Oylik vazifalar',
    progress: 'Progress',

    // KPI
    kpiScore: 'KPI ball',
    dailyKpi: 'Kunlik KPI',
    weeklyKpi: 'Haftalik KPI',
    monthlyKpi: 'Oylik KPI',
    performance: 'Samaradorlik',

    // Salary
    baseSalary: 'Asosiy maosh',
    penalties: 'Jarimalar',
    bonuses: 'Bonuslar',
    totalSalary: 'Jami maosh',

    // Budget
    monthlyBudget: 'Oylik byudjet',
    remaining: 'Qolgan',
    spent: 'Sarflangan',
    requestMoney: "Pul so'rash",
    requestAmount: 'Miqdor',
    requestNote: 'Izoh',
    approved: 'Tasdiqlangan',
    rejected: 'Rad etilgan',
    pendingApproval: 'Tasdiq kutilmoqda',

    // Support
    newIssue: 'Yangi muammo',
    issueTitle: 'Muammo nomi',
    issueDescription: 'Tavsif',
    attachFile: 'Fayl biriktirish',
    issueStatus: {
      pending: 'Kutilmoqda',
      inProgress: 'Jarayonda',
      resolved: 'Hal qilindi',
    },

    // Reminders
    reminders: 'Eslatmalar',
    workWithLeads: 'Bugun leadlar bilan ishlang',
    checkStudentResults: "O'quvchi natijalarini tekshiring",
    reviewTeachers: "O'qituvchilarni baholang",
    checkPayments: "To'lovlarni tekshiring",

    // Stats
    totalStudents: "Jami o'quvchilar",
    totalTeachers: "Jami o'qituvchilar",
    totalGroups: 'Jami guruhlar',
    totalLeads: 'Jami leadlar',
    activeStudents: "Faol o'quvchilar",
    newLeads: 'Yangi leadlar',
    monthlyRevenue: 'Oylik daromad',
    conversionRate: 'Konversiya',

    // Time
    hours: 'soat',
    minutes: 'daqiqa',

    // Theme
    lightMode: 'Yorug',
    darkMode: 'Qorong\'u',

    // Language
    language: 'Til',
    uzbek: "O'zbekcha",
    english: 'English',

    // Profile
    profile: 'Profil',
    manageYourAccount: 'Hisobingizni boshqaring',
    name: 'Ism',
    enterName: "Ismingizni kiriting",
    phone: 'Telefon',
    enterPhone: 'Telefon raqamingizni kiriting',
    email: 'Email',
    enterEmail: 'Email manzilingizni kiriting',
    oldPassword: 'Eski parol',
    enterOldPassword: 'Eski parolingizni kiriting',
    newPassword: 'Yangi parol',
    enterNewPassword: 'Yangi parolingizni kiriting',
    confirmPassword: 'Parolni tasdiqlang',
    confirmNewPassword: 'Yangi parolingizni tasdiqlang',
    changePassword: 'Parolni o\'zgartirish',
    resetPassword: 'Parolni tiklash',
    updateSuccess: 'Profil muvaffaqiyatli yangilandi',
    passwordChangedSuccess: 'Parol muvaffaqiyatli o\'zgartirildi',
    passwordMismatch: 'Parollar mos kelmadi',
    passwordTooShort: 'Parol kamida 6 ta belgidan iborat bo\'lishi kerak',
    wrongOldPassword: 'Eski parol noto\'g\'ri',
    forgotPasswordInfo: 'Parolingizni unutgan bo\'lsangiz, yangi parolni o\'rnatish uchun qo\'ng\'iroq qiling yoki admin bilan bog\'laning.',

    // Settings
    settings: 'Sozlamalar',
    customizeExperience: 'O\'z tajribaingizni sozlang',
    theme: 'Tema',
    darkModeActive: 'Qorong\'u rejim faol',
    lightModeActive: 'Yorug\' rejim faol',
    switchToLight: 'Yorug\'ga o\'tish',
    switchToDark: 'Qorong\'uga o\'tish',
    notificationsEnabled: 'Bildirishnomalar yoqilgan',
    notificationsDisabled: 'Bildirishnomalar o\'chirilgan',
    enable: 'Yoqish',
    disable: 'O\'chirish',
    notificationType: 'Bildirishnoma turlari',
    checkInNotification: 'Ish boshlash bildirishnomasi',
    budgetNotification: 'Byudjet bildirishnomasi',
    supportNotification: 'Qo\'llab-quvvatlash bildirishnomasi',
    taskNotification: 'Vazifa bildirishnomasi',
    privacySecurity: 'Xavfsizlik va maxfiylik',
    viewPrivacyPolicy: 'Maxfiylik siyosatini ko\'rish',
    viewTermsOfService: 'Foydalanish shartlarini ko\'rish',
    deleteAccount: 'Hisobni o\'chirish',
    about: 'Haqida',
    educationCenterManagement: 'Ta\'lim markazi boshqaruvi',

    // Performance Analytics
    employeePerformance: 'Xodimlar samaradorligi',
    performanceAnalytics: 'Samaradorlik tahlili',
    overallPerformance: 'Umumiy samaradorlik',
    taskCompletionRate: 'Vazifa bajarish foizi',
    performanceStatus: 'Samaradorlik holati',
    excellent: "Zo'r ishlayapti",
    average: "O'rtacha",
    poor: 'Sust ishlayapti',
    attendance: 'Davom-asosiy',
    lateArrivals: 'Kechikishlar',
    onTime: 'Vaqtida',
    tasksCompleted: 'Tugallangan vazifalar',
    tasksPending: 'Kutilayotgan vazifalar',
    kpiTrend: 'KPI tendensiyasi',
    employeeDetails: 'Xodim tafsilotlari',
    performanceDetails: 'Samaradorlik tafsilotlari',
    attendanceHistory: 'Davom-asosiy tarixi',
    salaryBreakdown: 'Ish haqi yoyilmasi',

    // Validation
    validation: {
      required: 'Ushbu maydon to\'ldirilishi shart',
      invalidEmail: 'Email noto\'g\'ri',
      minLength: 'Kamida {min} ta belgidan iborat bo\'lishi kerak',
    },

    // Common additions
    loading: 'Yuklanmoqda...',
    error: 'Xato',
    success: 'Muvaffaqiyat',
    warning: 'Ogohlantirish',
    new: 'yangi',
    markAllAsRead: "Hammasini o'qilgan deb belgilash",
    noNotifications: 'Bildirishnomalar yo\'q',
    viewDetails: 'Tafsilotlarni ko\'rish',
    viewAll: 'Hammasini ko\'rish',
  },
  en: {
    // Common
    appName: 'MX SUITE',
    login: 'Login',
    logout: 'Logout',
    save: 'Save',
    cancel: 'Cancel',
    delete: 'Delete',
    edit: 'Edit',
    add: 'Add',
    search: 'Search',
    filter: 'Filter',
    all: 'All',
    today: 'Today',
    week: 'Week',
    month: 'Month',
    year: 'Year',

    // Auth
    phoneNumber: 'Phone number',
    password: 'Password',
    forgotPassword: 'Forgot password?',
    loginTitle: 'Sign in',
    loginSubtitle: 'Manage your education center',
    invalidCredentials: 'Invalid phone number or password',

    // Dashboard
    dashboard: 'Dashboard',
    overview: 'Overview',
    welcomeBack: 'Welcome back',

    // Check-in
    checkIn: 'Start Work',
    checkOut: 'End Work',
    checkInRequired: "Click 'Start Work' to begin",
    workStarted: 'Work started',
    workEnded: 'Work ended',
    lateArrival: 'Late arrival',
    penalty: 'Penalty',

    // Roles
    director: 'Director',
    cto: 'CTO',
    academicManager: 'Academic Manager',
    marketingManager: 'Marketing Manager',
    administrator: 'Administrator',

    // Navigation
    employees: 'Employees',
    students: 'Students',
    teachers: 'Teachers',
    groups: 'Groups',
    schedule: 'Schedule',
    payments: 'Payments',
    leads: 'Leads',
    campaigns: 'Campaigns',
    tasks: 'Tasks',
    kpi: 'KPI',
    salary: 'Salary',
    budget: 'Budget',
    support: 'Support',
    notifications: 'Notifications',
    settings: 'Settings',
    reports: 'Reports',
    crm: 'CRM',

    // Tasks
    taskStatus: {
      pending: 'Pending',
      inProgress: 'In Progress',
      completed: 'Completed',
    },
    addTask: 'Add Task',
    taskTitle: 'Task title',
    taskDescription: 'Description',
    taskDeadline: 'Deadline',
    dailyTasks: 'Daily Tasks',
    weeklyTasks: 'Weekly Tasks',
    monthlyTasks: 'Monthly Tasks',
    progress: 'Progress',

    // KPI
    kpiScore: 'KPI Score',
    dailyKpi: 'Daily KPI',
    weeklyKpi: 'Weekly KPI',
    monthlyKpi: 'Monthly KPI',
    performance: 'Performance',

    // Salary
    baseSalary: 'Base Salary',
    penalties: 'Penalties',
    bonuses: 'Bonuses',
    totalSalary: 'Total Salary',

    // Budget
    monthlyBudget: 'Monthly Budget',
    remaining: 'Remaining',
    spent: 'Spent',
    requestMoney: 'Request Money',
    requestAmount: 'Amount',
    requestNote: 'Note',
    approved: 'Approved',
    rejected: 'Rejected',
    pendingApproval: 'Pending Approval',

    // Support
    newIssue: 'New Issue',
    issueTitle: 'Issue title',
    issueDescription: 'Description',
    attachFile: 'Attach file',
    issueStatus: {
      pending: 'Pending',
      inProgress: 'In Progress',
      resolved: 'Resolved',
    },

    // Reminders
    reminders: 'Reminders',
    workWithLeads: 'Work with leads today',
    checkStudentResults: 'Check student results',
    reviewTeachers: 'Review teachers',
    checkPayments: 'Check payments',

    // Stats
    totalStudents: 'Total Students',
    totalTeachers: 'Total Teachers',
    totalGroups: 'Total Groups',
    totalLeads: 'Total Leads',
    activeStudents: 'Active Students',
    newLeads: 'New Leads',
    monthlyRevenue: 'Monthly Revenue',
    conversionRate: 'Conversion Rate',

    // Time
    hours: 'hours',
    minutes: 'minutes',

    // Theme
    lightMode: 'Light',
    darkMode: 'Dark',

    // Language
    language: 'Language',
    uzbek: "O'zbekcha",
    english: 'English',

    // Profile
    profile: 'Profile',
    manageYourAccount: 'Manage your account',
    name: 'Name',
    enterName: 'Enter your name',
    phone: 'Phone',
    enterPhone: 'Enter your phone number',
    email: 'Email',
    enterEmail: 'Enter your email address',
    oldPassword: 'Old password',
    enterOldPassword: 'Enter your old password',
    newPassword: 'New password',
    enterNewPassword: 'Enter your new password',
    confirmPassword: 'Confirm password',
    confirmNewPassword: 'Confirm your new password',
    changePassword: 'Change password',
    resetPassword: 'Reset password',
    updateSuccess: 'Profile updated successfully',
    passwordChangedSuccess: 'Password changed successfully',
    passwordMismatch: 'Passwords do not match',
    passwordTooShort: 'Password must be at least 6 characters',
    wrongOldPassword: 'Old password is incorrect',
    forgotPasswordInfo: 'If you forgot your password, call or contact the administrator to set a new one.',

    // Settings
    customizeExperience: 'Customize your experience',
    theme: 'Theme',
    darkModeActive: 'Dark mode active',
    lightModeActive: 'Light mode active',
    switchToLight: 'Switch to Light',
    switchToDark: 'Switch to Dark',
    notificationsEnabled: 'Notifications enabled',
    notificationsDisabled: 'Notifications disabled',
    enable: 'Enable',
    disable: 'Disable',
    notificationType: 'Notification types',
    checkInNotification: 'Check-in notifications',
    budgetNotification: 'Budget notifications',
    supportNotification: 'Support notifications',
    taskNotification: 'Task notifications',
    privacySecurity: 'Privacy & Security',
    viewPrivacyPolicy: 'View Privacy Policy',
    viewTermsOfService: 'View Terms of Service',
    deleteAccount: 'Delete account',
    about: 'About',
    educationCenterManagement: 'Education Center Management',

    // Performance Analytics
    employeePerformance: 'Employee Performance',
    performanceAnalytics: 'Performance Analytics',
    overallPerformance: 'Overall Performance',
    taskCompletionRate: 'Task Completion Rate',
    performanceStatus: 'Performance Status',
    excellent: 'Excellent',
    average: 'Average',
    poor: 'Poor',
    attendance: 'Attendance',
    lateArrivals: 'Late Arrivals',
    onTime: 'On Time',
    tasksCompleted: 'Completed Tasks',
    tasksPending: 'Pending Tasks',
    kpiTrend: 'KPI Trend',
    employeeDetails: 'Employee Details',
    performanceDetails: 'Performance Details',
    attendanceHistory: 'Attendance History',
    salaryBreakdown: 'Salary Breakdown',

    // Validation
    validation: {
      required: 'This field is required',
      invalidEmail: 'Email is invalid',
      minLength: 'Must be at least {min} characters',
    },

    // Common additions
    loading: 'Loading...',
    error: 'Error',
    success: 'Success',
    warning: 'Warning',
    new: 'new',
    markAllAsRead: 'Mark all as read',
    noNotifications: 'No notifications',
    viewDetails: 'View details',
    viewAll: 'View all',
    common: {
      new: 'new',
      markAllAsRead: 'Mark all as read',
      noNotifications: 'No notifications',
      viewDetails: 'View details',
      viewAll: 'View all',
      loading: 'Loading...',
      profile: 'Profile',
      settings: 'Settings',
    },
  },
  required: 'Majburiy maydon',
} as const

export type TranslationKey = keyof typeof translations.uz
