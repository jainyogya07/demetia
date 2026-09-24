import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import { translations } from "../translations/translations";

const LanguageContext = createContext();

/*
  =====================================================
  NER STATE → LANGUAGE
  =====================================================
*/

export const REGION_LANGUAGE_MAP = {
  Assam: "as",

  "Arunachal Pradesh": "en",

  Manipur: "mni",

  Meghalaya: "kh",

  Mizoram: "mz",

  Nagaland: "en",

  Tripura: "bn",

  Sikkim: "ne",
};

/*
  =====================================================
  LANGUAGE → SPEECH CODE
  =====================================================
*/

export const SPEECH_LANGUAGE_CODES = {
  en: "en-IN",
  hi: "hi-IN",
  as: "as-IN",
  mni: "mni-IN",
  kh: "en-IN",
  mz: "en-IN",
  bn: "bn-IN",
  ne: "ne-IN",
};

export function LanguageProvider({ children }) {
  /*
    Current language
  */

  const [language, setLanguageState] = useState(() => {
    return (
      localStorage.getItem("smriti-language") ||
      "en"
    );
  });

  /*
    Detected NER state
  */

  const [detectedRegion, setDetectedRegion] = useState(() => {
    return (
      localStorage.getItem("smriti-region") ||
      ""
    );
  });

  /*
    Whether automatic language detection is enabled
  */

  const [isAutoLanguage, setIsAutoLanguage] = useState(() => {
    const saved =
      localStorage.getItem(
        "smriti-auto-language"
      );

    if (saved === null) {
      return true;
    }

    return saved === "true";
  });

  /*
    GPS coordinates
  */

  const [coordinates, setCoordinates] =
    useState(null);

  /*
    Location loading state
  */

  const [locationLoading, setLocationLoading] =
    useState(false);

  const [isDemoLocation, setIsDemoLocation] =
  useState(() => {
    return (
      localStorage.getItem("smriti-demo-location") ===
      "true"
    );
  });

  /*
    =====================================================
    SAVE LANGUAGE
    =====================================================
  */

  useEffect(() => {
    localStorage.setItem(
      "smriti-language",
      language
    );
  }, [language]);

  /*
    =====================================================
    TRANSLATION FUNCTION
    =====================================================
  */

  const t = (key) => {
    return (
      translations[language]?.[key] ||
      translations.en?.[key] ||
      key
    );
  };

  /*
    =====================================================
    MANUAL LANGUAGE CHANGE
    =====================================================

    If patient/caregiver manually chooses a language,
    automatic language switching is turned off.
  */

  const setLanguage = (
    newLanguage,
    manual = true
  ) => {
    if (!translations[newLanguage]) {
      console.warn(
        `Language "${newLanguage}" is not available in translations.js`
      );

      return;
    }

    setLanguageState(newLanguage);

    if (manual) {
      setIsAutoLanguage(false);

      localStorage.setItem(
        "smriti-auto-language",
        "false"
      );
    }
  };

  /*
    =====================================================
    FIND LANGUAGE FROM REGION
    =====================================================
  */

  const getLanguageFromRegion = (region) => {
    if (!region) {
      return "en";
    }

    /*
      Exact match
    */

    if (REGION_LANGUAGE_MAP[region]) {
      return REGION_LANGUAGE_MAP[region];
    }

    /*
      Partial match
      Useful if API returns something like:
      "State of Assam"
    */

    const matchedRegion = Object.keys(
      REGION_LANGUAGE_MAP
    ).find((state) =>
      region
        .toLowerCase()
        .includes(state.toLowerCase())
    );

    if (matchedRegion) {
      return REGION_LANGUAGE_MAP[
        matchedRegion
      ];
    }

    /*
      Safe fallback
    */

    return "en";
  };

  /*
    =====================================================
    DETECT LOCATION
    =====================================================
  */

  const detectRegionAndLanguage = () => {
    return new Promise((resolve) => {
      if (!navigator.geolocation) {
        console.error(
          "Geolocation is not supported."
        );

        setLocationLoading(false);

        resolve(null);

        return;
      }

      setLocationLoading(true);

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const latitude =
            position.coords.latitude;

          const longitude =
            position.coords.longitude;

          /*
            Save coordinates
          */

          setCoordinates({
            latitude,
            longitude,
          });

          try {
            /*
              Reverse geocoding
            */

            const response = await fetch(
              `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
            );

            if (!response.ok) {
              throw new Error(
                "Reverse geocoding failed"
              );
            }

            const data =
              await response.json();

            const region =
              data.principalSubdivision ||
              "";

            const country =
              data.countryName || "";

            console.log(
              "Detected country:",
              country
            );

            console.log(
              "Detected region:",
              region
            );

            /*
              Save region
            */

            setDetectedRegion(region);

            localStorage.setItem(
              "smriti-region",
              region
            );

            /*
              Automatically select language
            */

            if (isAutoLanguage) {
              const detectedLanguage =
                getLanguageFromRegion(region);

              /*
                Only switch if translations
                actually exist.
              */

              if (
                translations[
                  detectedLanguage
                ]
              ) {
                setLanguageState(
                  detectedLanguage
                );

                localStorage.setItem(
                  "smriti-language",
                  detectedLanguage
                );
              } else {
                /*
                  Translation not created yet.
                  Keep English.
                */

                setLanguageState("en");

                localStorage.setItem(
                  "smriti-language",
                  "en"
                );
              }
            }

            setLocationLoading(false);

            resolve({
              latitude,
              longitude,
              region,
              country,
            });
          } catch (error) {
            console.error(
              "Region detection failed:",
              error
            );

            setLocationLoading(false);

            resolve(null);
          }
        },

        (error) => {
          console.error(
            "Location permission error:",
            error
          );

          setLocationLoading(false);

          resolve(null);
        },

        {
          enableHighAccuracy: true,
          timeout: 15000,
          maximumAge: 300000,
        }
      );
    });
  };


  const setDemoRegion = (region) => {
  const demoLanguage =
    getLanguageFromRegion(region);

  setIsDemoLocation(true);

  localStorage.setItem(
    "smriti-demo-location",
    "true"
  );

  setDetectedRegion(region);

  localStorage.setItem(
    "smriti-region",
    region
  );

  /*
    Turn automatic language mode ON
    because this demo region is simulating
    automatic regional detection.
  */

  setIsAutoLanguage(true);

  localStorage.setItem(
    "smriti-auto-language",
    "true"
  );

  /*
    Change language if translation exists.
  */

  if (translations[demoLanguage]) {
    setLanguageState(demoLanguage);

    localStorage.setItem(
      "smriti-language",
      demoLanguage
    );
  } else {
    setLanguageState("en");

    localStorage.setItem(
      "smriti-language",
      "en"
    );
  }
};
  /*
    =====================================================
    ENABLE AUTOMATIC LANGUAGE
    =====================================================
  */

  const enableAutomaticLanguage =
    async () => {
      setIsDemoLocation(false);

      localStorage.setItem(
        "smriti-auto-language",
        "false"
      );
      
      setIsAutoLanguage(true);
      
      localStorage.setItem(
        "smriti-auto-language",
        "true"
      );


      await detectRegionAndLanguage();
    };

  /*
    =====================================================
    DETECT LOCATION WHEN APP OPENS
    =====================================================
  */

  useEffect(() => {
    if (isAutoLanguage) {
      detectRegionAndLanguage();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /*
    =====================================================
    SPEECH LANGUAGE
    =====================================================
  */

  const languageCode =
    SPEECH_LANGUAGE_CODES[language] ||
    "en-IN";

  /*
    =====================================================
    PROVIDER
    =====================================================
  */

  return (
    <LanguageContext.Provider
      value={{
        language,

        setLanguage,

        t,

        setDemoRegion,

        isDemoLocation,

        detectedRegion,

        coordinates,

        isAutoLanguage,

        locationLoading,

        detectRegionAndLanguage,

        enableAutomaticLanguage,

        languageCode,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

/*
  =====================================================
  HOOK
  =====================================================
*/

export function useLanguage() {
  return useContext(LanguageContext);
}