import { render, screen, fireEvent } from '@testing-library/react';
import { PortfolioDisplay } from './PortfolioDisplay';
import type { PortfolioData } from './types';

const data: PortfolioData = {
  fullName: 'Divya Shiral',
  email: 'divya@example.com',
  avatarUrl: 'https://example.com/ankit.jpg',
  yearsOfExperience: '4+ years',
  projectsCompletedCount: '40+',
  clientsServedCount: '25+',
  heroCtaText: 'Book a free call',
  heroCtaLink: 'https://calendly.com/ankit',
  calendarBookingUrl: 'https://calendly.com/ankit',
  projects: [
    {
      name: 'Shop',
      url: 'https://shop.example',
      tech: 'React',
      screenshotUrl: 'https://example.com/shop.png',
      resultHighlight: '40% faster checkout',
      isNotWorking: true,
    },
    { name: 'Healthy app', url: 'https://healthy.example', isNotWorking: false },
  ],
  featuredProjects: [
    { name: 'Side project', liveLink: 'https://side.example', isNotWorking: true },
  ],
  freelanceProjects: [
    {
      clientName: 'Northwind Cafe',
      clientType: 'Startup',
      liveLink: 'https://client.example',
      resultHighlight: '12 hrs/week saved',
      isNotWorking: true,
    },
  ],
  servicesDetailed: [
    {
      title: 'Website Development',
      description: 'Custom sites that convert.',
      problemItSolves: 'Slow, unclear websites',
      whoItIsFor: 'Startups',
    },
  ],
  services: ['This simple list should stay hidden'],
  faqItems: [
    { question: 'How long does a website take?', answer: 'Most sites launch in 3–5 weeks.' },
  ],
};

test('switches the main photo when another profile picture is chosen', () => {
  render(
    <PortfolioDisplay
      data={{
        ...data,
        avatarUrls: ['https://example.com/ankit.jpg', 'https://example.com/ankit-2.jpg'],
      }}
    />
  );

  expect(screen.getByAltText('Divya Shiral')).toHaveAttribute('src', 'https://example.com/ankit.jpg');
  fireEvent.click(screen.getByRole('button', { name: 'Show profile photo 2' }));
  expect(screen.getByAltText('Divya Shiral')).toHaveAttribute('src', 'https://example.com/ankit-2.jpg');
});

test('shows the developer photo and a not-working badge on flagged projects', () => {
  render(<PortfolioDisplay data={data} />);

  expect(screen.getByAltText('Divya Shiral')).toHaveAttribute('src', 'https://example.com/ankit.jpg');
  expect(screen.getAllByText('Currently not working')).toHaveLength(3);
  expect(screen.getAllByText('The live demo is currently unavailable.')).toHaveLength(3);
  expect(screen.getByRole('link', { name: 'View project (may be down) →' })).toHaveAttribute('href', 'https://shop.example');
  expect(screen.getByRole('link', { name: 'View project →' })).toHaveAttribute('href', 'https://healthy.example');
  expect(screen.getByRole('link', { name: 'Live (may be down) →' })).toBeInTheDocument();
  expect(screen.getByRole('link', { name: 'Open live site (may be down) →' })).toBeInTheDocument();
  expect(screen.queryByText('Healthy app')).toBeInTheDocument();
  expect(screen.getByRole('link', { name: 'Book a free call' })).toHaveAttribute('href', 'https://calendly.com/ankit');
  expect(screen.getByText('40+')).toBeInTheDocument();
  expect(screen.getByText('25+')).toBeInTheDocument();
  expect(screen.getByText('Northwind Cafe')).toBeInTheDocument();
  expect(screen.getByText('12 hrs/week saved')).toBeInTheDocument();
  expect(screen.getByText('40% faster checkout')).toBeInTheDocument();
  expect(screen.getByAltText('Shop')).toHaveAttribute('src', 'https://example.com/shop.png');
  expect(screen.getByText('Website Development')).toBeInTheDocument();
  expect(screen.getByText(/Startups/)).toBeInTheDocument();
  expect(screen.queryByText('This simple list should stay hidden')).not.toBeInTheDocument();
  expect(screen.getByText('How long does a website take?')).toBeInTheDocument();
  expect(screen.getByRole('link', { name: 'Book a call' })).toHaveAttribute('href', 'https://calendly.com/ankit');
});

test('hides a section when sectionVisibility is false', () => {
  render(<PortfolioDisplay data={{ ...data, sectionVisibility: { projects: false } }} />);

  expect(screen.queryByText('Shop')).not.toBeInTheDocument();
  expect(screen.getByText('Northwind Cafe')).toBeInTheDocument();
});
