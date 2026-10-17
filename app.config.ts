export default defineAppConfig({
  ui: {
    colors: { primary: "sky", neutral: "slate" },
    button: {
      compoundVariants: [
        {
          color: "primary",
          variant: "solid",
          class:
            "hover:bg-primary active:bg-primary hover:brightness-95 active:brightness-90 focus-visible:outline-primary",
        },
      ],
    },
    skeleton: { base: "motion-reduce:animate-none" },
  },
});
