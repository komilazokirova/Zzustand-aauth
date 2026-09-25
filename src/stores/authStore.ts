import { create } from "zustand";


import type {
  AuthTokens,
  LoginCredentials,
  Profile,
} from "../types/auth";
// TypeScript type'larini import qilyapmiz.
// AuthTokens → API login qilganda keladigan tokenlar.
// LoginCredentials → login uchun email va password.
// Profile → user profilining type'i.

import {
  createJSONStorage,
  persist,
} from "zustand/middleware";




const BASE_URL = "https://api.escuelajs.co/api/v1";


// Auth store ichida qanday ma'lumotlar bo'lishini belgilaymiz.
interface AuthStateStore {
  accessToken: string | null;


  refreshToken: string | null;
 

  profile: Profile | null;
 

  isLoading: boolean;
  // API request ketayotgan paytda true bo'ladi.
  // Request tugaganda false bo'ladi.

  error: string | null;
 


  // Login qiladigan funksiya.
  // credentials ichida email va password bo'ladi.
  login: (credentials: LoginCredentials) => Promise<void>;

  // User profilini API'dan olib keladigan funksiya.
  fetchProfile: () => Promise<void>;

  // Userni logout qiladigan funksiya.
  logout: () => void;
}


// useAuthStore nomli Zustand store yaratamiz.
export const useAuthStore = create<AuthStateStore>()(

  persist(

    // set → state'ni o'zgartirish uchun.
    // get → store'dagi hozirgi ma'lumotni olish uchun.
    (set, get) => ({

     
      accessToken: null,
      // Dastlab token yo'q.

      refreshToken: null,
      // Dastlab refresh token ham yo'q.

      profile: null,
      // Dastlab user profili yo'q.

      isLoading: false,
      // Hozircha API request ketmayapti.

      error: null,
      // Hozircha xatolik yo'q.


      // ==================================================
      // LOGIN
      // ==================================================

      login: async (credentials) => {
        // Login funksiyasi.
        // credentials ichida email va password keladi.

        set({
          isLoading: true,
          error: null,
        });
        // Login boshlanganda loading = true qilamiz.
        // Eski xatolik bo'lsa, uni tozalaymiz.


        try {
          // Xatolik chiqishi mumkin bo'lgan kodlarni try ichida yozamiz.

          const response = await fetch(
            `${BASE_URL}/auth/login`,
            {
              method: "POST",
              // Login qilishda POST request yuboramiz.

              headers: {
                "Content-Type": "application/json",
              },
              // API'ga JSON ma'lumot yuborayotganimizni aytamiz.

              body: JSON.stringify(credentials),
              // email va passwordni JSON ko'rinishiga o'tkazib yuboramiz.
            }
          );


          // Agar API yaxshi javob bermasa...
          if (!response.ok) {
            // Masalan noto'g'ri email yoki password bo'lsa.

            throw new Error(
              "Email yoki parol noto'g'ri"
            );
            // Xatolik chiqaramiz.
          }


          // API'dan kelgan javobni JSON qilib olamiz.
          // Natijada access_token va refresh_token keladi.
          const tokens: AuthTokens = await response.json();


          // Kelgan tokenlarni Zustand store'ga saqlaymiz.
          set({
            accessToken: tokens.access_token,
            // API bergan access_tokenni saqlaymiz.

            refreshToken: tokens.refresh_token,
            // API bergan refresh_tokenni saqlaymiz.

            isLoading: false,
            // Login tugadi, loadingni o'chiramiz.
          });


        } catch (err) {
          // Agar yuqoridagi kodlarda xatolik bo'lsa,
          // shu catch qismi ishlaydi.

          const message =
            err instanceof Error
              ? err.message
              : "Noma'lum xatolik";
          // Agar err Error bo'lsa, uning message'ini olamiz.
          // Aks holda "Noma'lum xatolik" deb olamiz.


          set({
            error: message,
            // Xatolikni store'ga yozamiz.

            isLoading: false,
            // Xatolik bo'lsa ham loadingni to'xtatamiz.
          });
        }
      },


      // ==================================================
      // FETCH PROFILE
      // ==================================================

      fetchProfile: async () => {
        // User profilini API'dan olish funksiyasi.


        // Store ichidan accessTokenni olamiz.
        const { accessToken } = get();


        // Agar accessToken bo'lmasa,
        // API'ga request yuborishning hojati yo'q.
        if (!accessToken) return;


        // Profilni olish boshlanganda loadingni yoqamiz.
        set({
          isLoading: true,
          error: null,
        });


        try {
          // API'ga profil olish uchun request yuboramiz.

          const response = await fetch(
            `${BASE_URL}/auth/profile`,
            {
              headers: {
                // API'ga tokenni yuboramiz.
                // API shu token orqali userni taniydi.
                Authorization: `Bearer ${accessToken}`,
              },
            }
          );


          // Agar server 401 qaytarsa,
          // token eskirgan yoki noto'g'ri bo'lishi mumkin.
          if (response.status === 401) {

            // Userni logout qilamiz.
            // Tokenlar va profil tozalanadi.
            get().logout();


            // Userga xatolik chiqaramiz.
            throw new Error(
              "Sessiya muddati tugadi, qaytadan kiring"
            );
          }


          // Agar boshqa turdagi xatolik bo'lsa...
          if (!response.ok) {
            throw new Error(
              "Profilni olishda xatolik"
            );
          }


          // API'dan kelgan profilni JSON qilib olamiz.
          const profile: Profile = await response.json();


          // Profilni Zustand store'ga saqlaymiz.
          set({
            profile,
            isLoading: false,
          });


        } catch (err) {
          // Profilni olish vaqtida xatolik chiqsa shu yerga keladi.

          const message =
            err instanceof Error
              ? err.message
              : "Noma'lum xatolik";
          // Xatolikning message'ini olamiz.


          set({
            error: message,
            // Xatolikni store'ga saqlaymiz.

            isLoading: false,
            // Loadingni to'xtatamiz.
          });
        }
      },


      // ==================================================
      // LOGOUT
      // ==================================================

      logout: () => {
        // User logout qilganda ishlaydigan funksiya.

        set({
          accessToken: null,
          // Access tokenni o'chiramiz.

          refreshToken: null,
          // Refresh tokenni o'chiramiz.

          profile: null,
          // User profilini o'chiramiz.

          error: null,
          // Eski xatolikni o'chiramiz.

          isLoading: false,
          // Loadingni false qilamiz.
        });
      },
    }),


    // ==================================================
    // PERSIST SOZLAMALARI
    // ==================================================

    {
      name: "auth-storage",
      // localStorage'da ma'lumot shu nom bilan saqlanadi.
      // Browser → Application → Local Storage'da ko'rish mumkin.


      storage: createJSONStorage(
        () => localStorage
      ),
      // Zustand ma'lumotlarini browser localStorage'iga saqlaymiz.


      partialize: (state) => ({
        // Store'dagi hamma narsani emas,
        // faqat kerakli ma'lumotlarni saqlaymiz.

        accessToken: state.accessToken,
        // accessToken localStorage'ga saqlanadi.

        refreshToken: state.refreshToken,
        // refreshToken ham localStorage'ga saqlanadi.
      }),
    },
  ),
);