import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import Pricing from '../Pricing';
import * as ThemeContext from '../../context/ThemeContext';
import * as reactRouterDom from 'react-router-dom';

// Mock framer-motion to avoid animation issues in tests
const MockMotion = ({ children, initial, animate, exit, variants, transition, whileHover, whileTap, whileInView, viewport, layout, ...props }, Tag = 'div') => {
  return <Tag {...props}>{children}</Tag>;
};

vi.mock('framer-motion', () => ({
  motion: {
    div: (props) => MockMotion(props, 'div'),
    button: (props) => MockMotion(props, 'button'),
    section: (props) => MockMotion(props, 'section'),
    h1: (props) => MockMotion(props, 'h1'),
    h2: (props) => MockMotion(props, 'h2'),
    p: (props) => MockMotion(props, 'p'),
    form: (props) => MockMotion(props, 'form'),
  },
  AnimatePresence: ({ children }) => <>{children}</>,
}));

// Mock dependencies
vi.mock('../../context/ThemeContext', () => ({
    useTheme: vi.fn(),
}));

// Partially mock react-router-dom to spy on useNavigate
vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return {
        ...actual,
        useNavigate: vi.fn(),
    };
});

const renderPricing = () => {
    return render(
        <BrowserRouter>
            <Pricing />
        </BrowserRouter>
    );
};

describe('Pricing Component', () => {
    const navigateMock = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
        ThemeContext.useTheme.mockReturnValue({ isDark: false }); 
        reactRouterDom.useNavigate.mockReturnValue(navigateMock);
        // Mock scroll methods if necessary
        window.scrollTo = vi.fn();
    });

    it('renders pricing plans correctly', () => {
        renderPricing();
        // Check if plan names exist (using getAllByText because name appears in header and table)
        const explorers = screen.getAllByText(/explorer/i);
        expect(explorers.length).toBeGreaterThan(0);
    });

    it('toggles billing cycle', async () => {
        renderPricing();
        
        // Find toggle button. Look for 'Monthly' and 'Yearly' text
        const yearlyTexts = screen.getAllByText(/yearly/i);
        expect(yearlyTexts.length).toBeGreaterThan(0);
        
        const monthlyTexts = screen.getAllByText(/monthly/i);
        expect(monthlyTexts.length).toBeGreaterThan(0);
        
        // Find the toggle button relative to the Monthly label
        // The button is in the same container as the first "Monthly" label
        const monthlyLabel = monthlyTexts[0];
        const container = monthlyLabel.parentElement;
        const toggleButton = within(container).getByRole('button');
        
        fireEvent.click(toggleButton); 
        
        // Check if "Save 17%" badge appears (appears when yearly is selected)
        await waitFor(() => {
            expect(screen.getByText(/save 17%/i)).toBeInTheDocument();
        });
    });

    it('navigates to signup for Explorer plan', () => {
        renderPricing();
        
        // Find the CTA button for Explorer plan
        // "Get Started Free" text is used for Explorer
        const explorerButton = screen.getByText(/get started free/i);
        
        fireEvent.click(explorerButton);
        
        expect(navigateMock).toHaveBeenCalledWith('/signup');
    });

    it('shows mock payment modal for other plans', () => {
        // Mock window.alert to prevent test error and verify call
        const alertMock = vi.spyOn(window, 'alert').mockImplementation(() => {});
        // Mock document.getElementById for modal
        const getElementByIdMock = vi.spyOn(document, 'getElementById').mockReturnValue(null); // Simulate modal missing -> alert
        
        renderPricing();
        
        // Find Upgrade Now buttons
        const upgradeButtons = screen.getAllByText(/upgrade now/i);
        if (upgradeButtons.length > 0) {
            fireEvent.click(upgradeButtons[0]);
            expect(alertMock).toHaveBeenCalledWith("Payment coming soon! 🚀");
        }
    });
});
