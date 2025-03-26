// Mock de Usuarios
export const MOCK_USERS = [
    {
      id: 1,
      name: 'Ana García',
      email: 'ana.garcia@utsjr.edu.mx',
      avatar: 'https://i.pravatar.cc/150?img=1',
      career: 'Desarrollo de Software',
      semester: 6,
      role: 'MENTOR'
    },
    {
      id: 2,
      name: 'Carlos Mendoza',
      email: 'carlos.mendoza@utsjr.edu.mx',
      avatar: 'https://i.pravatar.cc/150?img=2',
      career: 'Desarrollo de Software',
      semester: 7,
      role: 'MENTOR'
    },
    {
      id: 3,
      name: 'Laura Jiménez',
      email: 'laura.jimenez@utsjr.edu.mx',
      avatar: 'https://i.pravatar.cc/150?img=3',
      career: 'Desarrollo de Software',
      semester: 2,
      role: 'MENTEE'
    },
    {
      id: 4,
      name: 'Miguel Torres',
      email: 'miguel.torres@utsjr.edu.mx',
      avatar: 'https://i.pravatar.cc/150?img=4',
      career: 'Desarrollo de Software',
      semester: 1,
      role: 'MENTEE'
    },
    {
      id: 5,
      name: 'Sofia Ramírez',
      email: 'sofia.ramirez@utsjr.edu.mx',
      avatar: 'https://i.pravatar.cc/150?img=5',
      career: 'Desarrollo de Software',
      semester: 8,
      role: 'MENTOR'
    }
  ];
  
  // Mock de Perfiles de Mentores
  export const MOCK_MENTOR_PROFILES = [
    {
      id: 1,
      userId: 1,
      expertiseAreas: ['Programación Web', 'Bases de Datos', 'React'],
      topSubjects: [
        { name: 'Desarrollo Web Frontend', grade: 95 },
        { name: 'Bases de Datos SQL', grade: 98 },
        { name: 'Programación Orientada a Objetos', grade: 90 }
      ],
      availability: [
        { day: 1, startTime: '14:00', endTime: '16:00' },
        { day: 3, startTime: '15:00', endTime: '17:00' },
        { day: 5, startTime: '10:00', endTime: '12:00' }
      ],
      bio: 'Estudiante de último semestre con experiencia en desarrollo web y aplicaciones móviles. Me apasiona enseñar y compartir conocimientos con otros estudiantes.',
      rating: 4.8,
      completedSessions: 24
    },
    {
      id: 2,
      userId: 2,
      expertiseAreas: ['Algoritmos', 'Java', 'Estructura de Datos'],
      topSubjects: [
        { name: 'Estructura de Datos', grade: 96 },
        { name: 'Algoritmos', grade: 98 },
        { name: 'Programación en Java', grade: 93 }
      ],
      availability: [
        { day: 2, startTime: '13:00', endTime: '15:00' },
        { day: 4, startTime: '16:00', endTime: '18:00' }
      ],
      bio: 'Entusiasta de la programación con sólidos conocimientos en algoritmos y estructuras de datos. Me gusta resolver problemas complejos y ayudar a otros a mejorar sus habilidades.',
      rating: 4.6,
      completedSessions: 18
    },
    {
      id: 3,
      userId: 5,
      expertiseAreas: ['Diseño UX/UI', 'Desarrollo móvil', 'Figma'],
      topSubjects: [
        { name: 'Diseño de Interfaces', grade: 99 },
        { name: 'Desarrollo de Aplicaciones Móviles', grade: 94 },
        { name: 'Experiencia de Usuario', grade: 97 }
      ],
      availability: [
        { day: 1, startTime: '09:00', endTime: '11:00' },
        { day: 3, startTime: '14:00', endTime: '16:00' },
        { day: 5, startTime: '15:00', endTime: '17:00' }
      ],
      bio: 'Especializada en diseño de experiencias de usuario y desarrollo móvil. Creo firmemente en la importancia del diseño centrado en el usuario y disfruto compartiendo estos conocimientos.',
      rating: 4.9,
      completedSessions: 32
    }
  ];
  
  // Mock de Perfiles de Mentees
  export const MOCK_MENTEE_PROFILES = [
    {
      id: 1,
      userId: 3,
      interestAreas: ['Programación Web', 'JavaScript', 'React'],
      currentSubjects: ['Fundamentos de Programación Web', 'Bases de Datos I', 'Algoritmos Básicos'],
      availability: [
        { day: 1, startTime: '16:00', endTime: '18:00' },
        { day: 4, startTime: '14:00', endTime: '16:00' }
      ],
      learningGoals: ['Dominar React', 'Mejorar en desarrollo frontend', 'Aprender sobre APIs RESTful'],
      academicRiskLevel: 1
    },
    {
      id: 2,
      userId: 4,
      interestAreas: ['Programación Básica', 'Lógica de Programación', 'HTML/CSS'],
      currentSubjects: ['Introducción a la Programación', 'Matemáticas Discretas', 'Inglés Técnico'],
      availability: [
        { day: 2, startTime: '15:00', endTime: '17:00' },
        { day: 5, startTime: '10:00', endTime: '12:00' }
      ],
      learningGoals: ['Entender conceptos básicos de programación', 'Desarrollar mi primer sitio web', 'Mejorar la lógica de resolución de problemas'],
      academicRiskLevel: 2
    }
  ];
  
  // Mock de Mentorías
  export const MOCK_MENTORSHIPS = [
    {
      id: 1,
      mentorId: 1,
      menteeId: 1,
      status: 'ACTIVE',
      startDate: '2023-09-01',
      endDate: null,
      focusAreas: ['React', 'JavaScript', 'Frontend'],
      notes: 'Sesiones enfocadas en desarrollo frontend con React',
      mentorRating: 5,
      menteeRating: 4.5
    },
    {
      id: 2,
      mentorId: 2,
      menteeId: 2,
      status: 'ACTIVE',
      startDate: '2023-08-15',
      endDate: null,
      focusAreas: ['Algoritmos', 'Lógica de Programación', 'Java'],
      notes: 'Reforzamiento de conceptos básicos de programación',
      mentorRating: 4.8,
      menteeRating: 4.7
    },
    {
      id: 3,
      mentorId: 3,
      menteeId: 1,
      status: 'COMPLETE',
      startDate: '2023-05-10',
      endDate: '2023-07-20',
      focusAreas: ['Diseño UI', 'UX', 'Wireframing'],
      notes: 'Mentoría en diseño de interfaces y experiencia de usuario.',
      mentorRating: 4.9,
      menteeRating: 5
    }
  ];
  
  // Mock de Sesiones
  export const MOCK_SESSIONS = [
    {
      id: 1,
      mentorshipId: 1,
      title: 'Introducción a React Hooks',
      date: '2023-09-15',
      startTime: '15:00',
      endTime: '16:30',
      mode: 'VIRTUAL',
      location: 'Google Meet',
      status: 'COMPLETED',
      topics: ['useState', 'useEffect', 'Custom Hooks'],
      resources: [
        { title: 'Documentación de React Hooks', type: 'LINK', url: 'https://reactjs.org/docs/hooks-intro.html' },
        { title: 'Ejemplos prácticos', type: 'DOCUMENT', url: 'https://example.com/documento.pdf' }
      ],
      notes: 'Revisamos los hooks básicos y creamos algunos ejemplos.',
      feedback: {
        mentor: {
          usefulness: 4,
          engagement: 5,
          comments: 'Muy buena participación y preguntas interesantes.'
        },
        mentee: {
          clarity: 5,
          usefulness: 5,
          comments: 'Explicación clara y ejemplos muy útiles.'
        }
      }
    },
    {
      id: 2,
      mentorshipId: 1,
      title: 'Estado global con Context API',
      date: '2023-09-22',
      startTime: '15:00',
      endTime: '16:30',
      mode: 'VIRTUAL',
      location: 'Google Meet',
      status: 'SCHEDULED',
      topics: ['Context API', 'useContext', 'Estado global'],
      resources: [],
      notes: '',
      feedback: null
    },
    {
      id: 3,
      mentorshipId: 2,
      title: 'Estructuras de Control en Java',
      date: '2023-09-18',
      startTime: '14:00',
      endTime: '15:30',
      mode: 'IN_PERSON',
      location: 'Laboratorio B5',
      status: 'COMPLETED',
      topics: ['Condicionales', 'Bucles', 'Switch'],
      resources: [
        { title: 'Ejercicios prácticos', type: 'DOCUMENT', url: 'https://example.com/ejercicios.pdf' }
      ],
      notes: 'Revisamos diferentes estructuras de control con ejercicios prácticos.',
      feedback: {
        mentor: {
          usefulness: 4,
          engagement: 3,
          comments: 'Buena sesión, aunque faltó un poco más de participación.'
        },
        mentee: {
          clarity: 5,
          usefulness: 4,
          comments: 'Me quedaron claros los conceptos. Necesito practicar más.'
        }
      }
    },
    {
      id: 4,
      mentorshipId: 2,
      title: 'Arrays y Colecciones',
      date: '2023-09-25',
      startTime: '14:00',
      endTime: '15:30',
      mode: 'IN_PERSON',
      location: 'Laboratorio B5',
      status: 'SCHEDULED',
      topics: ['Arrays', 'ArrayList', 'HashMaps'],
      resources: [],
      notes: '',
      feedback: null
    }
  ];
  
  // Mock de Recursos Educativos
  export const MOCK_RESOURCES = [
    {
      id: 1,
      title: 'Guía Completa de React',
      description: 'Guía detallada sobre React y sus principales características.',
      type: 'DOCUMENT',
      subject: 'Desarrollo Web Frontend',
      topics: ['React', 'JavaScript', 'Frontend'],
      url: 'https://example.com/react-guide.pdf',
      createdBy: 1,
      ratings: [
        { userId: 3, score: 5, comment: 'Excelente guía, muy completa y clara.' },
        { userId: 4, score: 4, comment: 'Muy útil para principiantes.' }
      ],
      averageRating: 4.5,
      downloads: 28
    },
    {
      id: 2,
      title: 'Introducción a Bases de Datos SQL',
      description: 'Material de apoyo para aprender los fundamentos de SQL.',
      type: 'DOCUMENT',
      subject: 'Bases de Datos',
      topics: ['SQL', 'Relacional', 'Consultas'],
      url: 'https://example.com/sql-basics.pdf',
      createdBy: 2,
      ratings: [
        { userId: 3, score: 5, comment: 'Me ayudó mucho a entender los conceptos básicos.' },
        { userId: 1, score: 5, comment: 'Excelente recurso para repasar.' }
      ],
      averageRating: 5,
      downloads: 35
    },
    {
      id: 3,
      title: 'Colección de Ejercicios de Algoritmos',
      description: 'Conjunto de problemas algorítmicos con soluciones.',
      type: 'DOCUMENT',
      subject: 'Algoritmos',
      topics: ['Algoritmos', 'Lógica', 'Programación'],
      url: 'https://example.com/algoritmos-ejercicios.pdf',
      createdBy: 2,
      ratings: [
        { userId: 4, score: 4, comment: 'Buena variedad de ejercicios.' }
      ],
      averageRating: 4,
      downloads: 22
    },
    {
      id: 4,
      title: 'Tutorial de Figma para UI/UX',
      description: 'Guía paso a paso para utilizar Figma en diseño de interfaces.',
      type: 'VIDEO',
      subject: 'Diseño de Interfaces',
      topics: ['Figma', 'UI', 'UX', 'Diseño'],
      url: 'https://example.com/figma-tutorial.mp4',
      createdBy: 5,
      ratings: [
        { userId: 1, score: 5, comment: 'Tutorial muy claro y completo.' },
        { userId: 3, score: 5, comment: 'Me fue de gran utilidad para aprender Figma.' }
      ],
      averageRating: 5,
      downloads: 42
    }
  ];
  
  // Mock de Estadísticas para Dashboard
  export const MOCK_DASHBOARD_STATS = {
    activeMentorships: 15,
    completedSessions: 87,
    upcomingSessions: 23,
    averageMentorRating: 4.7,
    mentorshipsBySubject: [
      { subject: 'Programación Web', count: 8 },
      { subject: 'Algoritmos', count: 5 },
      { subject: 'Bases de Datos', count: 4 },
      { subject: 'Diseño UX/UI', count: 3 }
    ],
    monthlySessionsData: [
      { month: 'Ene', sessions: 12 },
      { month: 'Feb', sessions: 15 },
      { month: 'Mar', sessions: 18 },
      { month: 'Abr', sessions: 16 },
      { month: 'May', sessions: 20 },
      { month: 'Jun', sessions: 22 },
      { month: 'Jul', sessions: 18 },
      { month: 'Ago', sessions: 24 },
      { month: 'Sep', sessions: 28 }
    ],
    topMentors: [
      { id: 5, name: 'Sofia Ramírez', sessions: 32, rating: 4.9 },
      { id: 1, name: 'Ana García', sessions: 24, rating: 4.8 },
      { id: 2, name: 'Carlos Mendoza', sessions: 18, rating: 4.6 }
    ],
    recentResources: [
      { id: 4, title: 'Tutorial de Figma para UI/UX', downloads: 42 },
      { id: 2, title: 'Introducción a Bases de Datos SQL', downloads: 35 },
      { id: 1, title: 'Guía Completa de React', downloads: 28 }
    ]
  };