import { useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation } from '@tanstack/react-query';
import { Send, CheckCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { trackFormSubmit } from '@/lib/analytics';

const contactSchema = z.object({
  name: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  email: z.string().email("Por favor ingresa un correo electrónico válido"),
  phone: z.string().optional(),
  message: z.string().min(10, "El mensaje debe tener al menos 10 caracteres"),
  plan: z.string().optional(),
});

type ContactFormData = z.infer<typeof contactSchema>;

const plans = [
  { value: 'basico', label: 'Plan Lanzamiento - 499€' },
  { value: 'profesional', label: 'Plan Profesional - 999€' },
  { value: 'ecommerce', label: 'Plan E-commerce - 1.999€' },
];

export function ContactForm() {
  const [isSuccess, setIsSuccess] = useState(false);
  const { toast } = useToast();

  const form = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      message: '',
      plan: '',
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: ContactFormData) => {
      const response = await apiRequest('POST', '/api/contact', data);
      return response.json();
    },
    onSuccess: (data) => {
      trackFormSubmit('contact', true);
      setIsSuccess(true);
      toast({
        title: "Mensaje enviado",
        description: data.message || "Te contactaremos pronto.",
      });
      form.reset();
      setTimeout(() => setIsSuccess(false), 5000);
    },
    onError: (error: Error) => {
      trackFormSubmit('contact', false);
      toast({
        title: "Error",
        description: error.message || "No se pudo enviar el mensaje. Intenta de nuevo.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: ContactFormData) => {
    mutation.mutate(data);
  };

  return (
    <section id="contact" className="py-24 bg-gradient-to-b from-navy-900 to-black" data-testid="section-contact">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="inline-block px-4 py-2 rounded-full bg-blue-500/10 text-blue-400 text-sm font-medium mb-4">
            Contacto
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 font-display">
            ¿Listo para empezar?
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Cuéntanos sobre tu proyecto y te responderemos en menos de 24 horas
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="max-w-2xl mx-auto"
        >
          <div className="bg-navy-900/50 border border-blue-500/10 rounded-2xl p-8 backdrop-blur-sm">
            {isSuccess ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-12"
              >
                <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-white mb-2">Mensaje enviado</h3>
                <p className="text-gray-400">Te contactaremos pronto. Revisa tu correo.</p>
              </motion.div>
            ) : (
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-white">Nombre *</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="Tu nombre"
                              className="bg-navy-800/50 border-blue-500/20 text-white placeholder:text-gray-500 focus:border-blue-400"
                              data-testid="input-contact-name"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-white">Email *</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              type="email"
                              placeholder="tu@email.com"
                              className="bg-navy-800/50 border-blue-500/20 text-white placeholder:text-gray-500 focus:border-blue-400"
                              data-testid="input-contact-email"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-white">Teléfono</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              type="tel"
                              placeholder="+34 600 000 000"
                              className="bg-navy-800/50 border-blue-500/20 text-white placeholder:text-gray-500 focus:border-blue-400"
                              data-testid="input-contact-phone"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="plan"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-white">Plan de interés</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger
                                className="bg-navy-800/50 border-blue-500/20 text-white"
                                data-testid="select-contact-plan"
                              >
                                <SelectValue placeholder="Selecciona un plan" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="bg-navy-900 border-blue-500/20">
                              {plans.map((plan) => (
                                <SelectItem
                                  key={plan.value}
                                  value={plan.value}
                                  className="text-white hover:bg-blue-500/10"
                                  data-testid={`option-plan-${plan.value}`}
                                >
                                  {plan.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white">Mensaje *</FormLabel>
                        <FormControl>
                          <Textarea
                            {...field}
                            placeholder="Cuéntanos sobre tu proyecto, qué necesitas y cualquier detalle importante..."
                            rows={5}
                            className="bg-navy-800/50 border-blue-500/20 text-white placeholder:text-gray-500 focus:border-blue-400 resize-none"
                            data-testid="textarea-contact-message"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button
                    type="submit"
                    disabled={mutation.isPending}
                    className="w-full bg-blue-500 hover:bg-blue-600 text-white py-6 text-lg"
                    data-testid="button-submit-contact"
                  >
                    {mutation.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Enviando...
                      </>
                    ) : (
                      <>
                        <Send className="mr-2 h-5 w-5" />
                        Enviar mensaje
                      </>
                    )}
                  </Button>

                  <p className="text-center text-gray-500 text-sm">
                    Al enviar, aceptas nuestra política de privacidad. Te responderemos en menos de 24 horas.
                  </p>
                </form>
              </Form>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
