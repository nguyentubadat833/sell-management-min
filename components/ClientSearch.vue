<script setup lang="ts">
const emit = defineEmits(['searchComplete'])

const router = useRouter()
const {data: searchData} = await useFetch('/api/client/search-data')
const commandPaletteRef = ref()

const categoriesActions = computed(() => searchData.value?.categories?.map(category => {
  return {
    id: category.alias,
    label: category.name,
    click: () => {
      navigateTo(`/${category.alias}`)
      emit('searchComplete')
    }
  }
}))
const productsActions = computed(() => searchData.value?.products?.map(product => {
  return {
    id: product.alias,
    label: product.name,
    avatar: {
      src: joinPath('/images', product.images[0]?.location, product.images[0]?.name),
      loading: 'lazy'
    },
    click: () => {
      navigateTo(`/${product.category.alias}/${product.alias}`)
      emit('searchComplete')
    }
  }
}))

const groups = computed(() =>
    [commandPaletteRef.value?.query
        ? {
          key: 'products',
          label: 'Tìm kiếm theo sản phẩm',
          commands: productsActions.value
        }
        : {
          key: 'recent',
          label: 'Gợi ý mới nhất',
          commands: productsActions.value?.slice(0, 5)
        }, {
      key: 'categories',
      label: 'Tìm kiếm theo danh mục',
      commands: categoriesActions.value
    }].filter(Boolean))

function onSelect(option: any) {
  if (option.click) {
    option.click()
  } else if (option.to) {
    router.push(option.to)
  } else if (option.href) {
    window.open(option.href, '_blank')
  }
}
</script>

<template>
  <div>
    <UCommandPalette ref="commandPaletteRef" class="min-h-96 max-h-[70vh]" :groups="groups" :autoselect="false" @update:model-value="onSelect"/>
  </div>
</template>

