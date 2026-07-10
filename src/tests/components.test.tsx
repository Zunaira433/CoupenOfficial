import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import Pagination from "@/components/Pagination";
import Breadcrumbs from "@/components/Breadcrumbs";
import NewsletterForm from "@/components/NewsletterForm";

describe("Pagination", () => {
  it("renders nothing when totalPages <= 1", () => {
    const { container } = render(<Pagination currentPage={1} totalPages={1} basePath="/test" />);
    expect(container.firstChild).toBeNull();
  });

  it("renders page links when totalPages > 1", () => {
    render(<Pagination currentPage={2} totalPages={5} basePath="/test" />);
    expect(screen.getByText("2")).toBeInTheDocument();
    expect(screen.getByLabelText("Next page")).toBeInTheDocument();
    expect(screen.getByLabelText("Previous page")).toBeInTheDocument();
  });

  it("marks current page with aria-current", () => {
    render(<Pagination currentPage={3} totalPages={5} basePath="/blog" />);
    expect(screen.getByText("3").closest("[aria-current='page']")).toBeInTheDocument();
  });
});

describe("Breadcrumbs", () => {
  it("always renders Home as first crumb", () => {
    render(<Breadcrumbs crumbs={[{ label: "Blog", href: "/blog" }, { label: "My Post" }]} />);
    expect(screen.getByText("Home")).toBeInTheDocument();
  });

  it("marks last crumb with aria-current=page", () => {
    render(<Breadcrumbs crumbs={[{ label: "Blog", href: "/blog" }, { label: "My Post" }]} />);
    expect(screen.getByText("My Post").closest("[aria-current='page']")).toBeInTheDocument();
  });

  it("renders intermediate crumbs as links", () => {
    render(<Breadcrumbs crumbs={[{ label: "Blog", href: "/blog" }, { label: "My Post" }]} />);
    expect(screen.getByRole("link", { name: "Blog" })).toHaveAttribute("href", "/blog");
  });
});

describe("NewsletterForm", () => {
  it("renders email input and submit button", () => {
    render(<NewsletterForm />);
    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /subscribe/i })).toBeInTheDocument();
  });

  it("email input accepts typed text", () => {
    render(<NewsletterForm />);
    const input = screen.getByLabelText(/email address/i) as HTMLInputElement;
    fireEvent.change(input, { target: { value: "test@example.com" } });
    expect(input.value).toBe("test@example.com");
  });
});
