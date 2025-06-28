import { describe, expect, it } from 'vitest';
import { convertToFormData } from '../../../src/lib/profile';
import type { GetProfileData } from '../../../src/server/api/routers/types';

// Mock data generator for testing
const createMockProfileData = (overrides: Partial<GetProfileData> = {}): GetProfileData => ({
  id: 'user-123',
  firstName: 'John',
  lastName: 'Doe',
  email: 'john.doe@example.com',
  phoneNumber: '+1234567890',
  website: 'https://johndoe.dev',
  linkedinUrl: 'https://linkedin.com/in/johndoe',
  githubUrl: 'https://github.com/johndoe',
  education: [
    {
      id: 'edu-1',
      userId: 'user-123',
      institution: 'MIT',
      degree: 'Bachelor of Science in Computer Science',
      isAttending: false,
      startDate: new Date('2020-09-01'),
      endDate: new Date('2024-05-15'),
      gpa: '3.8',
      awards: 'Dean\'s List, Magna Cum Laude',
      coursework: 'Data Structures, Algorithms, Machine Learning',
      createdAt: new Date(),
      updatedAt: new Date(),
    }
  ],
  experience: [
    {
      id: 'exp-1',
      userId: 'user-123',
      company: 'Tech Corp',
      jobTitle: 'Software Engineer',
      location: 'San Francisco, CA',
      isCurrentJob: true,
      startDate: new Date('2024-06-01'),
      endDate: null,
      achievements: ['Built scalable microservices', 'Improved performance by 40%'],
      technologies: 'React, Node.js, PostgreSQL',
      createdAt: new Date(),
      updatedAt: new Date(),
    }
  ],
  projects: [
    {
      id: 'proj-1',
      userId: 'user-123',
      name: 'Portfolio Website',
      description: 'Personal portfolio built with Next.js',
      url: 'https://johndoe.dev',
      achievements: ['10k+ monthly visitors', 'Featured on dev blogs'],
      technologies: 'Next.js, TypeScript, Tailwind CSS',
      createdAt: new Date(),
      updatedAt: new Date(),
    }
  ],
  skills: {
    languages: 'JavaScript, TypeScript, Python',
    frameworks: 'React, Next.js, Express.js',
  },
  createdAt: new Date(),
  updatedAt: new Date(),
  ...overrides,
});

describe('convertToFormData', () => {
  it('returns undefined when profileData is null', () => {
    expect(convertToFormData(null)).toBeUndefined();
  });

  it('returns undefined when profileData is undefined', () => {
    expect(convertToFormData(undefined)).toBeUndefined();
  });

  it('converts complete profile data to form data structure', () => {
    const mockData = createMockProfileData();
    const result = convertToFormData(mockData);

    expect(result).toEqual({
      personalDetails: {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        phoneNumber: '+1234567890',
        website: 'https://johndoe.dev',
        linkedinUrl: 'https://linkedin.com/in/johndoe',
        githubUrl: 'https://github.com/johndoe',
      },
      education: [
        {
          institution: 'MIT',
          degree: 'Bachelor of Science in Computer Science',
          isAttending: false,
          startDate: new Date('2020-09-01'),
          endDate: new Date('2024-05-15'),
          gpa: '3.8',
          awards: 'Dean\'s List, Magna Cum Laude',
          coursework: 'Data Structures, Algorithms, Machine Learning',
        }
      ],
      experience: [
        {
          company: 'Tech Corp',
          jobTitle: 'Software Engineer',
          location: 'San Francisco, CA',
          isCurrentJob: true,
          startDate: new Date('2024-06-01'),
          endDate: undefined,
          achievements: ['Built scalable microservices', 'Improved performance by 40%'],
          technologies: 'React, Node.js, PostgreSQL',
        }
      ],
      projects: [
        {
          name: 'Portfolio Website',
          description: 'Personal portfolio built with Next.js',
          url: 'https://johndoe.dev',
          achievements: ['10k+ monthly visitors', 'Featured on dev blogs'],
          technologies: 'Next.js, TypeScript, Tailwind CSS',
        }
      ],
      skills: {
        languages: 'JavaScript, TypeScript, Python',
        frameworks: 'React, Next.js, Express.js',
      },
    });
  });

  it('handles profile data with null/undefined optional fields', () => {
    const mockData = createMockProfileData({
      phoneNumber: null,
      website: null,
      linkedinUrl: null,
      githubUrl: null,
    });
    
    const result = convertToFormData(mockData);

    expect(result?.personalDetails).toEqual({
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      phoneNumber: '',
      website: undefined,
      linkedinUrl: undefined,
      githubUrl: undefined,
    });
  });

  it('handles empty arrays for education, experience, and projects', () => {
    const mockData = createMockProfileData({
      education: [],
      experience: [],
      projects: [],
    });
    
    const result = convertToFormData(mockData);

    expect(result?.education).toEqual([]);
    expect(result?.experience).toEqual([]);
    expect(result?.projects).toEqual([]);
  });

  it('handles null arrays for education, experience, and projects', () => {
    const mockData = createMockProfileData({
      education: null,
      experience: null,
      projects: null,
    });
    
    const result = convertToFormData(mockData);

    expect(result?.education).toEqual([]);
    expect(result?.experience).toEqual([]);
    expect(result?.projects).toEqual([]);
  });

  it('handles undefined arrays for education, experience, and projects', () => {
    const mockData = createMockProfileData({
      education: undefined,
      experience: undefined,
      projects: undefined,
    });
    
    const result = convertToFormData(mockData);

    expect(result?.education).toEqual([]);
    expect(result?.experience).toEqual([]);
    expect(result?.projects).toEqual([]);
  });

  it('converts education with null optional fields', () => {
    const mockData = createMockProfileData({
      education: [
        {
          id: 'edu-1',
          userId: 'user-123',
          institution: 'University',
          degree: 'Bachelor',
          isAttending: true,
          startDate: new Date('2020-09-01'),
          endDate: null,
          gpa: null,
          awards: null,
          coursework: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        }
      ]
    });
    
    const result = convertToFormData(mockData);

    expect(result?.education[0]).toEqual({
      institution: 'University',
      degree: 'Bachelor',
      isAttending: true,
      startDate: new Date('2020-09-01'),
      endDate: undefined as unknown as Date,
      gpa: undefined,
      awards: undefined,
      coursework: undefined,
    });
  });

  it('converts experience with null optional fields', () => {
    const mockData = createMockProfileData({
      experience: [
        {
          id: 'exp-1',
          userId: 'user-123',
          company: 'Company',
          jobTitle: 'Developer',
          location: 'Remote',
          isCurrentJob: false,
          startDate: new Date('2022-01-01'),
          endDate: new Date('2023-12-31'),
          achievements: null,
          technologies: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        }
      ]
    });
    
    const result = convertToFormData(mockData);

    expect(result?.experience[0]).toEqual({
      company: 'Company',
      jobTitle: 'Developer',
      location: 'Remote',
      isCurrentJob: false,
      startDate: new Date('2022-01-01'),
      endDate: new Date('2023-12-31'),
      achievements: [],
      technologies: undefined,
    });
  });

  it('converts projects with null optional fields', () => {
    const mockData = createMockProfileData({
      projects: [
        {
          id: 'proj-1',
          userId: 'user-123',
          name: 'Project',
          description: 'A simple project',
          url: null,
          achievements: null,
          technologies: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        }
      ]
    });
    
    const result = convertToFormData(mockData);

    expect(result?.projects[0]).toEqual({
      name: 'Project',
      description: 'A simple project',
      url: undefined,
      achievements: [],
      technologies: undefined,
    });
  });

  it('handles null skills object', () => {
    const mockData = createMockProfileData({
      skills: null,
    });
    
    const result = convertToFormData(mockData);

    expect(result?.skills).toEqual({
      languages: undefined,
      frameworks: undefined,
    });
  });

  it('handles skills with null properties', () => {
    const mockData = createMockProfileData({
      skills: {
        languages: null,
        frameworks: null,
      },
    });
    
    const result = convertToFormData(mockData);

    expect(result?.skills).toEqual({
      languages: undefined,
      frameworks: undefined,
    });
  });

  it('handles multiple education entries', () => {
    const mockData = createMockProfileData({
      education: [
        {
          id: 'edu-1',
          userId: 'user-123',
          institution: 'High School',
          degree: 'Diploma',
          isAttending: false,
          startDate: new Date('2016-09-01'),
          endDate: new Date('2020-06-15'),
          gpa: '3.9',
          awards: 'Valedictorian',
          coursework: 'AP Computer Science',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 'edu-2',
          userId: 'user-123',
          institution: 'University',
          degree: 'Bachelor of Science',
          isAttending: true,
          startDate: new Date('2020-09-01'),
          endDate: new Date('2024-05-15'),
          gpa: '3.7',
          awards: null,
          coursework: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        }
      ]
    });
    
    const result = convertToFormData(mockData);

    expect(result?.education).toHaveLength(2);
    expect(result?.education[0]?.institution).toBe('High School');
    expect(result?.education[1]?.institution).toBe('University');
  });

  it('handles multiple experience entries', () => {
    const mockData = createMockProfileData({
      experience: [
        {
          id: 'exp-1',
          userId: 'user-123',
          company: 'Startup Inc',
          jobTitle: 'Intern',
          location: 'Remote',
          isCurrentJob: false,
          startDate: new Date('2023-06-01'),
          endDate: new Date('2023-08-31'),
          achievements: ['Learned React', 'Built feature'],
          technologies: 'React, JavaScript',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 'exp-2',
          userId: 'user-123',
          company: 'Big Corp',
          jobTitle: 'Full Stack Developer',
          location: 'New York, NY',
          isCurrentJob: true,
          startDate: new Date('2024-01-01'),
          endDate: null,
          achievements: ['Led team', 'Improved performance'],
          technologies: 'Node.js, React, PostgreSQL',
          createdAt: new Date(),
          updatedAt: new Date(),
        }
      ]
    });
    
    const result = convertToFormData(mockData);

    expect(result?.experience).toHaveLength(2);
    expect(result?.experience[0]?.company).toBe('Startup Inc');
    expect(result?.experience[1]?.company).toBe('Big Corp');
  });

  it('handles date conversion properly', () => {
    const startDate = new Date('2020-09-01T08:00:00.000Z');
    const endDate = new Date('2024-05-15T16:30:00.000Z');
    
    const mockData = createMockProfileData({
      education: [
        {
          id: 'edu-1',
          userId: 'user-123',
          institution: 'Test University',
          degree: 'Test Degree',
          isAttending: false,
          startDate,
          endDate,
          gpa: null,
          awards: null,
          coursework: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        }
      ]
    });
    
    const result = convertToFormData(mockData);

    expect(result?.education[0]?.startDate).toEqual(startDate);
    expect(result?.education[0]?.endDate).toEqual(endDate);
  });
}); 