import {ref} from "vue";

const useToggleTheme = () => {
    const isDark = ref(true);

    const toggleTheme = () => {
        isDark.value = !isDark.value;
        document.documentElement.classList.toggle('dark', isDark.value);
    };

    return {
        isDark,
        toggleTheme,
    };
}

export default useToggleTheme;