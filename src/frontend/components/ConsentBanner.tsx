import { Button } from "@/components/ui/button";
import clsx from "clsx";
import { useEffect, useState } from "react";

declare global {
    interface Window {
        dataLayer: any[];
        gtag: (...args: any[]) => void;
    }
}

const GA_ID = "G-KTKLM4669T";

function setConsentDefaults() {
    window.dataLayer = window.dataLayer || [];
    window.gtag = function gtag(){window.dataLayer.push(arguments);};
    window.gtag('consent', 'default', {
        'ad_storage': 'denied',
        'analytics_storage': 'denied',
    });
}

function updateConsent(consent: 'granted' | 'denied') {
    if (typeof window.gtag === 'function') {
        window.gtag('consent', 'update', {
            'ad_storage': consent === 'granted' ? 'granted' : 'denied',
            'analytics_storage': consent === 'granted' ? 'granted' : 'denied',
        });
    }
}

function loadGAScript() {
    if (document.getElementById("ga-script")) return;
    const script = document.createElement("script");
    script.id = "ga-script";
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
    document.head.appendChild(script);

    const inlineScript = document.createElement("script");
    inlineScript.innerHTML = `
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', '${GA_ID}');
    `;
    document.head.appendChild(inlineScript);
}

export default function ConsentBanner() {
    const [visible, setVisible] = useState(() => {
        return localStorage.getItem("cookie_consent") !== "true" && localStorage.getItem("cookie_consent") !== "false";
    });

    useEffect(() => {
        setConsentDefaults();
        const consent = localStorage.getItem("cookie_consent");
        if (consent === "true") {
            updateConsent('granted');
            loadGAScript();
        } else if (consent === "false") {
            updateConsent('denied');
        }
    }, []);

    const accept = () => {
        localStorage.setItem("cookie_consent", "true");
        updateConsent('granted');
        loadGAScript();
        setVisible(false);
    };

    const reject = () => {
        localStorage.setItem("cookie_consent", "false");
        updateConsent('denied');
        setVisible(false);
    };

    if (!visible) return null;

    return (
        <div
            className={clsx(
                "fixed bottom-0 left-0 right-0 z-[1000] flex flex-col sm:flex-row justify-center items-center border-t gap-4 sm:gap-0",
                "bg-card text-card-foreground p-4 sm:py-4 sm:px-8 shadow-[0_4px_20px_-4px_hsl(var(--primary)/0.08)]"
            )}
        >
            <span className="mb-2 sm:mb-0 sm:mr-4 text-sm sm:text-base text-center sm:text-left max-w-xs sm:max-w-none">
                We use cookies to analyze traffic and improve your experience. Please select your preference. You can change your choice at any time in your browser settings.
            </span>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-3 w-full sm:w-auto">
                <Button onClick={accept} variant="default" className="w-full sm:w-auto">
                    Accept All
                </Button>
                <Button
                    onClick={reject}
                    variant="secondary"
                    className="w-full sm:w-auto"
                >
                    Reject All
                </Button>
            </div>
        </div>
    );
}
