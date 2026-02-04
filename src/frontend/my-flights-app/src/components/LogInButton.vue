<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const logIn = () => {
    router.push('/login')
}
</script>

<template>
    <button @click="logIn" class="bg-white text-blue-600 px-4 py-2 rounded">
        Log In
    </button>
</template>

