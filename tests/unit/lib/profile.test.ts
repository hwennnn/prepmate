import { describe, expect, it } from 'vitest';
import { convertProfileToOnboardingForm } from '../../../src/lib/profile';
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

describe('convertProfileToOnboardingForm', () => {
  it('returns undefined when profileData is null or undefined', () => {
    expect(convertProfileToOnboardingForm(null)).toBeUndefined();
    expect(convertProfileToOnboardingForm(undefined)).toBeUndefined();
  });

  it('converts complete profile data to form data structure', () => {
    const mockData = createMockProfileData();
    const result = convertProfileToOnboardingForm(mockData);

    expect(result).toEqual({
      profileId: 'user-123',
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

  it('handles profile data with null optional fields', () => {
    const mockData = createMockProfileData({
      phoneNumber: null,
      website: null,
      linkedinUrl: null,
      githubUrl: null,
    });
    
    const result = convertProfileToOnboardingForm(mockData);

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

  it('handles empty or null arrays for education, experience, and projects', () => {
    const mockData = createMockProfileData({
      education: [],
      experience: null,
      projects: undefined,
    });
    
    const result = convertProfileToOnboardingForm(mockData);

    expect(result?.education).toEqual([]);
    expect(result?.experience).toEqual([]);
    expect(result?.projects).toEqual([]);
  });
});