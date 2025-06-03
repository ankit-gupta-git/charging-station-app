<template>
  <div class="flex relative mt-8 lg:mt-0 lg:pl-8 lg:pb-4 lg:pt-1 lg:pr-0">
    <i class="flex items-center justify-center w-8 h-8 text-gray-700 lg:absolute lg:top-1/2 lg:left-[-26px] lg:-translate-y-1/2 lg:border lg:border-gray-200 lg:bg-white lg:rounded-lg lg:w-[50px] lg:h-[50px]">
      <slot name="icon"></slot>
    </i>
    <div class="flex-1 ml-4">
      <h3 class="text-lg font-medium mb-2 text-gray-800">
        <slot name="heading"></slot>
      </h3>
      <slot></slot>
    </div>
    <!-- Decorative lines for timeline effect on large screens -->
    <div class="hidden lg:block absolute left-0 top-0 h-1/2 w-px bg-gray-200" :class="{ 'hidden': $el?.parentElement?.firstElementChild === $el }"></div>
    <div class="hidden lg:block absolute left-0 bottom-0 h-1/2 w-px bg-gray-200" :class="{ 'hidden': $el?.parentElement?.lastElementChild === $el }"></div>
  </div>
</template>

<style scoped>
.item {
  margin-top: 2rem;
  display: flex;
  position: relative;
}

.details {
  flex: 1;
  margin-left: 1rem;
}

i {
  display: flex;
  place-items: center;
  place-content: center;
  width: 32px;
  height: 32px;

  color: var(--color-text);
}

h3 {
  font-size: 1.2rem;
  font-weight: 500;
  margin-bottom: 0.4rem;
  color: var(--color-heading);
}

@media (min-width: 1024px) {
  .item {
    margin-top: 0;
    padding: 0.4rem 0 1rem calc(var(--section-gap) / 2);
  }

  i {
    top: calc(50% - 25px);
    left: -26px;
    position: absolute;
    border: 1px solid var(--color-border);
    background: var(--color-background);
    border-radius: 8px;
    width: 50px;
    height: 50px;
  }

  .item:before {
    content: ' ';
    border-left: 1px solid var(--color-border);
    position: absolute;
    left: 0;
    bottom: calc(50% + 25px);
    height: calc(50% - 25px);
  }

  .item:after {
    content: ' ';
    border-left: 1px solid var(--color-border);
    position: absolute;
    left: 0;
    top: calc(50% + 25px);
    height: calc(50% - 25px);
  }

  .item:first-of-type:before {
    display: none;
  }

  .item:last-of-type:after {
    display: none;
  }
}
</style>
