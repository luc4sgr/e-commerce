import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Lock, 
  Edit2, 
  Save, 
  X,
  AlertTriangle
} from 'lucide-react';
import api from '../../services/api';
import { authService } from '../../services/auth.service';
import { notificationService } from '../../services/notification.service';
import PageContainer from '../../components/PageContainer';
import styles from './Profile.module.scss';


const profileSchema = z.object({
  name: z.string().min(3, 'Nome deve ter pelo menos 3 caracteres'),
  email: z.string().email('E-mail inválido'),
  phone: z.string().optional(),
  address: z.string().optional()
});


const passwordSchema = z.object({
  currentPassword: z.string().min(6, 'Senha atual deve ter pelo menos 6 caracteres'),
  newPassword: z.string().min(6, 'Nova senha deve ter pelo menos 6 caracteres'),
  confirmPassword: z.string().min(6, 'Confirmação de senha deve ter pelo menos 6 caracteres')
}).refine(data => data.newPassword === data.confirmPassword, {
  message: 'As senhas não coincidem',
  path: ['confirmPassword']
});

type ProfileFormValues = z.infer<typeof profileSchema>;
type PasswordFormValues = z.infer<typeof passwordSchema>;

interface UserProfile {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  admin: boolean;
}

const Profile: React.FC = () => {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { 
    register: registerProfile, 
    handleSubmit: handleSubmitProfile, 
    reset: resetProfile,
    formState: { errors: profileErrors, isDirty: isProfileDirty }
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema)
  });
  

  const { 
    register: registerPassword, 
    handleSubmit: handleSubmitPassword, 
    reset: resetPassword,
    formState: { errors: passwordErrors }
  } = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema)
  });
  

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setIsLoading(true);

        const storedUser = authService.getCurrentUser();
        
        if (!storedUser) {
          throw new Error('Usuário não encontrado');
        }
        
        // const mockUserProfile: UserProfile = {
        //   ...storedUser,
        //   phone: '(11) 98765-4321',
        //   address: 'Rua Exemplo, 123 - São Paulo, SP'
        // };
        
        // setUserProfile(mockUserProfile);
        // resetProfile(mockUserProfile);
        setError(null);
      } catch (err: any) {
        setError('Erro ao carregar perfil');
        notificationService.error(
          'Falha ao carregar perfil', 
          'Não foi possível obter seus dados. Tente novamente mais tarde.'
        );
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchUserProfile();
  }, [resetProfile]);
  
  const onSaveProfile = async (data: ProfileFormValues) => {
    try {
      setIsLoading(true);
      
      setTimeout(() => {
        if (userProfile) {
          const updatedProfile = { ...userProfile, ...data };
          setUserProfile(updatedProfile);
          
          const currentUser = authService.getCurrentUser();
          if (currentUser) {
            const updatedUser = { ...currentUser, name: data.name, email: data.email };
            localStorage.setItem('@EcommerceApp:user', JSON.stringify(updatedUser));
          }
          
          notificationService.success(
            'Perfil atualizado', 
            'Suas informações foram atualizadas com sucesso!'
          );
          setIsEditMode(false);
        }
        setIsLoading(false);
      }, 1000);
      
    } catch (err: any) {
      setIsLoading(false);
      notificationService.error(
        'Erro ao atualizar',
        'Não foi possível salvar suas alterações. Tente novamente.'
      );
      console.error(err);
    }
  };

  const onChangePassword = async (data: PasswordFormValues) => {
    try {
      setIsLoading(true);
      
      // await api.post('/me/change-password', data);
      
      setTimeout(() => {
        notificationService.success(
          'Senha alterada', 
          'Sua senha foi alterada com sucesso!'
        );
        resetPassword();
        setIsChangingPassword(false);
        setIsLoading(false);
      }, 1000);
      
    } catch (err: any) {
      setIsLoading(false);
      notificationService.error(
        'Erro ao atualizar senha',
        'Não foi possível alterar sua senha. Verifique se a senha atual está correta.'
      );
      console.error(err);
    }
  };
  
  const handleCancelEdit = () => {
    if (userProfile) {
      resetProfile(userProfile);
    }
    setIsEditMode(false);
  };
  
  const handleCancelPasswordChange = () => {
    resetPassword();
    setIsChangingPassword(false);
  };
  
  return (
    <PageContainer title="Meu Perfil">
      {isLoading && !userProfile ? (
        <div className={styles.loadingContainer}>
          <div className={styles.spinner}></div>
          <p>Carregando perfil...</p>
        </div>
      ) : error ? (
        <div className={styles.errorContainer}>
          <AlertTriangle size={40} color="#ef4444" />
          <p>{error}</p>
          <button 
            className={styles.retryButton}
            onClick={() => window.location.reload()}
          >
            Tentar Novamente
          </button>
        </div>
      ) : (
        <div className={styles.profileContainer}>
          <div className={styles.profileHeader}>
            <div className={styles.profileAvatar}>
              <User size={40} />
            </div>
            <div className={styles.profileInfo}>
              <h2>{userProfile?.name}</h2>
              <p className={styles.userRole}>
                {userProfile?.admin ? 'Administrador' : 'Cliente'}
              </p>
            </div>
          </div>
          
          <div className={styles.profileSections}>

            <div className={styles.profileSection}>
              <div className={styles.sectionHeader}>
                <h3>Informações Pessoais</h3>
                {!isEditMode ? (
                  <motion.button 
                    className={styles.editButton}
                    onClick={() => setIsEditMode(true)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Edit2 size={16} />
                    Editar
                  </motion.button>
                ) : (
                  <div className={styles.editActions}>
                    <motion.button 
                      className={styles.cancelButton}
                      onClick={handleCancelEdit}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <X size={16} />
                      Cancelar
                    </motion.button>
                    <motion.button 
                      className={styles.saveButton}
                      onClick={handleSubmitProfile(onSaveProfile)}
                      disabled={!isProfileDirty || isLoading}
                      whileHover={{ scale: isProfileDirty && !isLoading ? 1.05 : 1 }}
                      whileTap={{ scale: isProfileDirty && !isLoading ? 0.95 : 1 }}
                    >
                      <Save size={16} />
                      Salvar
                    </motion.button>
                  </div>
                )}
              </div>
              
              <div className={styles.sectionContent}>
                <form className={styles.profileForm}>
                  <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                      <label htmlFor="name">Nome Completo</label>
                      <div className={styles.inputWithIcon}>
                        <User size={18} className={styles.inputIcon} />
                        <input
                          id="name"
                          type="text"
                          {...registerProfile('name')}
                          disabled={!isEditMode || isLoading}
                          className={profileErrors.name ? styles.inputError : ''}
                        />
                      </div>
                      {profileErrors.name && (
                        <span className={styles.errorMessage}>{profileErrors.name.message}</span>
                      )}
                    </div>
                  </div>
                  
                  <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                      <label htmlFor="email">E-mail</label>
                      <div className={styles.inputWithIcon}>
                        <Mail size={18} className={styles.inputIcon} />
                        <input
                          id="email"
                          type="email"
                          {...registerProfile('email')}
                          disabled={!isEditMode || isLoading}
                          className={profileErrors.email ? styles.inputError : ''}
                        />
                      </div>
                      {profileErrors.email && (
                        <span className={styles.errorMessage}>{profileErrors.email.message}</span>
                      )}
                    </div>
                  </div>
                  
                  <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                      <label htmlFor="phone">Telefone</label>
                      <div className={styles.inputWithIcon}>
                        <Phone size={18} className={styles.inputIcon} />
                        <input
                          id="phone"
                          type="text"
                          {...registerProfile('phone')}
                          disabled={!isEditMode || isLoading}
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                      <label htmlFor="address">Endereço</label>
                      <div className={styles.inputWithIcon}>
                        <MapPin size={18} className={styles.inputIcon} />
                        <input
                          id="address"
                          type="text"
                          {...registerProfile('address')}
                          disabled={!isEditMode || isLoading}
                        />
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            </div>
            
            <div className={styles.profileSection}>
              <div className={styles.sectionHeader}>
                <h3>Segurança</h3>
                {!isChangingPassword ? (
                  <motion.button 
                    className={styles.editButton}
                    onClick={() => setIsChangingPassword(true)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Edit2 size={16} />
                    Alterar Senha
                  </motion.button>
                ) : (
                  <div className={styles.editActions}>
                    <motion.button 
                      className={styles.cancelButton}
                      onClick={handleCancelPasswordChange}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <X size={16} />
                      Cancelar
                    </motion.button>
                    <motion.button 
                      className={styles.saveButton}
                      onClick={handleSubmitPassword(onChangePassword)}
                      disabled={isLoading}
                      whileHover={{ scale: !isLoading ? 1.05 : 1 }}
                      whileTap={{ scale: !isLoading ? 0.95 : 1 }}
                    >
                      <Save size={16} />
                      Salvar
                    </motion.button>
                  </div>
                )}
              </div>
              
              <div className={styles.sectionContent}>
                {isChangingPassword ? (
                  <form className={styles.passwordForm}>
                    <div className={styles.formRow}>
                      <div className={styles.formGroup}>
                        <label htmlFor="currentPassword">Senha Atual</label>
                        <div className={styles.inputWithIcon}>
                          <Lock size={18} className={styles.inputIcon} />
                          <input
                            id="currentPassword"
                            type="password"
                            {...registerPassword('currentPassword')}
                            disabled={isLoading}
                            className={passwordErrors.currentPassword ? styles.inputError : ''}
                          />
                        </div>
                        {passwordErrors.currentPassword && (
                          <span className={styles.errorMessage}>{passwordErrors.currentPassword.message}</span>
                        )}
                      </div>
                    </div>
                    
                    <div className={styles.formRow}>
                      <div className={styles.formGroup}>
                        <label htmlFor="newPassword">Nova Senha</label>
                        <div className={styles.inputWithIcon}>
                          <Lock size={18} className={styles.inputIcon} />
                          <input
                            id="newPassword"
                            type="password"
                            {...registerPassword('newPassword')}
                            disabled={isLoading}
                            className={passwordErrors.newPassword ? styles.inputError : ''}
                          />
                        </div>
                        {passwordErrors.newPassword && (
                          <span className={styles.errorMessage}>{passwordErrors.newPassword.message}</span>
                        )}
                      </div>
                    </div>
                    
                    <div className={styles.formRow}>
                      <div className={styles.formGroup}>
                        <label htmlFor="confirmPassword">Confirmar Nova Senha</label>
                        <div className={styles.inputWithIcon}>
                          <Lock size={18} className={styles.inputIcon} />
                          <input
                            id="confirmPassword"
                            type="password"
                            {...registerPassword('confirmPassword')}
                            disabled={isLoading}
                            className={passwordErrors.confirmPassword ? styles.inputError : ''}
                          />
                        </div>
                        {passwordErrors.confirmPassword && (
                          <span className={styles.errorMessage}>{passwordErrors.confirmPassword.message}</span>
                        )}
                      </div>
                    </div>
                  </form>
                ) : (
                  <div className={styles.securityInfo}>
                    <div className={styles.securityItem}>
                      <div className={styles.securityLabel}>Senha</div>
                      <div className={styles.securityValue}>••••••••</div>
                    </div>
                    <div className={styles.securityItem}>
                      <div className={styles.securityLabel}>Última Atualização</div>
                      <div className={styles.securityValue}>10/03/2023</div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </PageContainer>
  );
};

export default Profile;