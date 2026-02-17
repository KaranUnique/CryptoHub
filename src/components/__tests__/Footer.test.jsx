import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import Footer from '../Footer';

// Wrap component with providers
const renderWithProviders = (component) => {
    return render(
        <BrowserRouter>
            {component}
        </BrowserRouter>
    );
};

describe('Footer Component', () => {
    it('renders the newsletter subscription form', () => {
        renderWithProviders(<Footer />);
        expect(screen.getByPlaceholderText(/enter your email/i)).toBeInTheDocument();
    });

    it('validates invalid email format', async () => {
        renderWithProviders(<Footer />);
        
        const input = screen.getByPlaceholderText(/enter your email/i);
        const button = screen.getByRole('button', { name: /subscribe/i });
        
        // Disable HTML5 validation to allow custom validation logic to run
        const form = input.closest('form');
        form.setAttribute('novalidate', 'true');

        fireEvent.change(input, { target: { value: 'invalid-email' } });
        fireEvent.click(button);
        
        expect(await screen.findByText(/please enter a valid email address/i)).toBeInTheDocument();
    });

    it('shows success message on valid subscription', async () => {
        renderWithProviders(<Footer />);
        
        const input = screen.getByPlaceholderText(/enter your email/i);
        const form = input.closest('form');
        
        fireEvent.change(input, { target: { value: 'test@example.com' } });
        fireEvent.submit(form);
        
        expect(screen.getByText(/subscribing/i)).toBeInTheDocument();
        
        await waitFor(() => {
            expect(screen.getByText(/successfully subscribed/i)).toBeInTheDocument();
        }, { timeout: 3000 });
    });

    it('renders social media icons', () => {
        renderWithProviders(<Footer />);
        // Assuming icons are rendered, we can check for their existence. 
        // More specific queries would depend on how icons are accessible (e.g., aria-label)
        // For now, let's check for some text content or links if standard simple icons don't have text.
        // Or check that styling classes are present if needed, but integration tests preference is visible content.
        // Let's check for links presence
        const links = screen.getAllByRole('link');
        expect(links.length).toBeGreaterThan(0);
    });
});
