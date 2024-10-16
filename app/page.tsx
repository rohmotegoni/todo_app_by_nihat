"use client";

import { useState, useEffect, useRef } from "react";
import Cookies from "js-cookie";
import axios from "axios";
import { useRouter } from "next/navigation";
import { LogOut, Loader2, List, PlusCircle } from "lucide-react";

export default function HomePage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingButton, setLoadingButton] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  async function handleLogout() {
    setIsLoading(true);
    try {
      Cookies.remove("auth_token", { path: "/" });
      const response = await axios.post(`/api/clearcookie`);
      if (response.status === 200) {
        router.push("/signin");
      }
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleViewTodos() {
    setLoadingButton("viewTodos");
    try {
      console.log("Navigating to todos list...");
      // Simulate API call or navigation delay
      await new Promise((resolve) => setTimeout(resolve, 1000));
      // Add your navigation logic here
    } finally {
      setLoadingButton(null);
    }
  }

  async function handleCreateTodo() {
    setLoadingButton("createTodo");
    try {
      console.log("Navigating to create todo page...");
      await new Promise((resolve) => setTimeout(resolve, 1000));
      router.push("/createtodo");
    } finally {
      setLoadingButton(null);
    }
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const styles = {
    container: {
      minHeight: "100vh",
      backgroundColor: "#f5f5f5",
      fontFamily: "Arial, sans-serif",
      color: "#333",
    },
    header: {
      borderBottom: "1px solid #e0e0e0",
      backgroundColor: "#ffffff",
      boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
    },
    headerContent: {
      maxWidth: "800px",
      margin: "0 auto",
      padding: "1rem",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
    },
    menuButton: {
      background: "none",
      border: "none",
      fontSize: "36px",
      cursor: "pointer",
      color: "#333",
      transition: "transform 0.3s ease",
      width: "60px",
      height: "60px",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      borderRadius: "50%",
    },
    menuButtonOpen: {
      transform: "rotate(90deg)",
    },
    appTitle: {
      fontSize: "24px",
      fontWeight: "bold",
      color: "#333",
    },
    dropdown: {
      position: "relative" as const,
    },
    dropdownContent: {
      position: "absolute" as const,
      right: 0,
      backgroundColor: "#ffffff",
      minWidth: "160px",
      boxShadow: "0px 8px 16px 0px rgba(0,0,0,0.2)",
      zIndex: 1,
      opacity: 0,
      transform: "translateY(-10px)",
      transition: "opacity 0.3s ease, transform 0.3s ease",
      pointerEvents: "none" as const,
    },
    dropdownContentOpen: {
      opacity: 1,
      transform: "translateY(0)",
      pointerEvents: "auto" as const,
    },
    dropdownItem: {
      color: "#333",
      padding: "12px 16px",
      textDecoration: "none",
      // display: "block",
      cursor: "pointer",
      transition: "background-color 0.3s ease",
      display: "flex",
      alignItems: "center",
      gap: "8px",
    },
    main: {
      maxWidth: "800px",
      margin: "0 auto",
      padding: "2rem 1rem",
    },
    buttonContainer: {
      display: "flex",
      flexDirection: "column" as const,
      alignItems: "center",
      gap: "1rem",
    },
    button: {
      backgroundColor: "#333",
      border: "none",
      color: "white",
      padding: "15px 32px",
      textAlign: "center" as const,
      textDecoration: "none",
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: "16px",
      margin: "4px 2px",
      cursor: "pointer",
      borderRadius: "4px",
      width: "100%",
      maxWidth: "300px",
      transition: "all 0.3s ease",
      position: "relative" as const,
      overflow: "hidden",
    },
    buttonHover: {
      backgroundColor: "#555",
    },
    buttonRipple: {
      position: "absolute" as const,
      borderRadius: "50%",
      transform: "scale(0)",
      animation: "ripple 0.6s linear",
      backgroundColor: "rgba(255, 255, 255, 0.7)",
    },
    loadingOverlay: {
      position: "fixed" as const,
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 1000,
    },
    loadingSpinner: {
      width: "50px",
      height: "50px",
      border: "5px solid #f3f3f3",
      borderTop: "5px solid #3498db",
      borderRadius: "50%",
      animation: "spin 1s linear infinite",
    },
  };

  const rippleEffect = (event: React.MouseEvent<HTMLButtonElement>) => {
    const button = event.currentTarget;
    const ripple = document.createElement("span");
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;

    ripple.style.width = ripple.style.height = `${size}px`;
    ripple.style.left = `${x}px`;
    ripple.style.top = `${y}px`;

    ripple.style.position = "absolute";
    ripple.style.borderRadius = "50%";
    ripple.style.transform = "scale(0)";
    ripple.style.animation = "ripple 0.6s linear";
    ripple.style.backgroundColor = "rgba(255, 255, 255, 0.7)";

    button.appendChild(ripple);

    setTimeout(() => {
      ripple.remove();
    }, 600);
  };

  return (
    <div style={styles.container}>
      <style jsx global>{`
        @keyframes ripple {
          to {
            transform: scale(4);
            opacity: 0;
          }
        }
        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
      `}</style>
      {isLoading && (
        <div style={styles.loadingOverlay}>
          <div style={styles.loadingSpinner}></div>
        </div>
      )}
      <header style={styles.header}>
        <div style={styles.headerContent}>
          <div style={styles.appTitle}>Todo App</div>
          <div style={{ width: "24px" }}></div>
          <div style={styles.dropdown} ref={menuRef}>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              style={{
                ...styles.menuButton,
                ...(isMenuOpen ? styles.menuButtonOpen : {}),
              }}
            >
              &#8942;
            </button>
            <div
              style={{
                ...styles.dropdownContent,
                ...(isMenuOpen ? styles.dropdownContentOpen : {}),
              }}
            >
              <a
                style={styles.dropdownItem}
                onClick={handleLogout}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.backgroundColor = "#f0f0f0")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor = "transparent")
                }
              >
                <LogOut size={18} />
                Logout
              </a>
            </div>
          </div>
        </div>
      </header>
      <main style={styles.main}>
        <div style={styles.buttonContainer}>
          <button
            style={styles.button}
            onClick={(e) => {
              handleViewTodos();
              rippleEffect(e);
            }}
            onMouseEnter={(e) =>
              Object.assign(e.currentTarget.style, styles.buttonHover)
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor =
                styles.button.backgroundColor)
            }
            disabled={loadingButton === "viewTodos"}
          >
            {loadingButton === "viewTodos" ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <List className="mr-2 h-4 w-4" />
            )}{" "}
            View Todos
          </button>
          <button
            style={styles.button}
            onClick={(e) => {
              handleCreateTodo();
              rippleEffect(e);
            }}
            onMouseEnter={(e) =>
              Object.assign(e.currentTarget.style, styles.buttonHover)
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor =
                styles.button.backgroundColor)
            }
            disabled={loadingButton === "createTodo"}
          >
            {loadingButton === "createTodo" ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <PlusCircle className="mr-2 h-4 w-4" />
            )}{" "}
            Create Todo
          </button>
        </div>
      </main>
    </div>
  );
}
